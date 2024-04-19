/**
 * Binary to JSON codec for Non-IP Modems compatible with ORBCOMM/IDP waveform
 */
const fs = require('fs');
const bitwise = require('bitwise');
const xmlParser = require('xml2json');
const terseCodec = process.env.NIMO_CODEC_TERSE;

const parser = {
  'arrayField': parseArrayField,
  'uintField': parseUintField,
  'intField': parseIntField,
  'boolField': parseBoolField,
  'enumField': parseEnumField,
  'stringField': parseStringField,
  'dataField': parseDataField,
};

const substitutions = {
  SIN: 'codecServiceId',
  MIN: 'codecMessageId',
  'xsi:type': 'type',
  ForwardMessages: 'mobileTerminatedMessages',
  ReturnMessages: 'mobileOriginatedMessages',
  ArrayField: 'arrayField',
  BooleanField: 'boolField',
  DataField: 'dataField',
  EnumField: 'enumField',          
  UnsignedIntField: 'uintField',
  SignedIntField: 'intField',
};

/**
 * @typedef Field
 * @property {string} name The field name (unique among parent fields)
 * @property {string} type The type of data represented
 * @property {string} [description] Optional description of purpose/use
 * @property {boolean} [optional] Optional flag indicating presence
 * @property {boolean} [fixed] Optional flag indicating fixed size
 * @property {number} [size] Semi-optional (max) size in bits/bytes/elements
 * @property {string[]} [items] Array of strings defining enum values
 * @property {any} [default] Optional default value if not populated
 */

/**
 * @typedef Message
 * @property {string} name
 * @property {string} [description]
 * @property {number} codecMessageId
 * @property {Field[]} fields
 */

/**
 * @typedef Service
 * @property {string} name
 * @property {string} [description]
 * @property {number} codecServiceId
 * @property {Message[]} [mobileOriginatedMessages]
 * @property {Message[]} [mobileTerminatedMessages]
 */

/**
 * @typedef Codec
 * @property {string} [name]
 * @property {string} [description]
 * @property {string} [version]
 * @property {Service[]} services
 */

/**
 * Read a subset of bits from a data Buffer
 * @param {Buffer} buffer The raw payload buffer
 * @param {number} offset The bit offset to start reading from
 * @param {number} length The number of bits to read
 * @param {boolean} bytes If true return a Buffer instead of number
 * @returns A number or Buffer of the bits read
 */
function extractBits(buffer, offset, length, bytes = false) {
  if (!Buffer.isBuffer(buffer)) throw new Error('Invalid data buffer');
  if (offset + length > 8*buffer.length) throw new Error('Invalid bit range');
  if (typeof bytes != 'boolean') bytes = false;
  if (length < 2**32 && !bytes) {
    return bitwise.buffer.readUInt(buffer, offset, length);
  }
  return bitwise.buffer.create(bitwise.buffer.read(buffer, offset, length));
}

/**
 * Decode a field to an object
 * @param {Field} field The field definition
 * @param {Buffer} buffer The raw payload buffer
 * @param {number} offset The starting bit of the field in the buffer
 * @returns A decoded field object
 */
function parseField(field, buffer, offset) {
  let fieldPresent = 1;
  if (Object.hasOwn(field, 'optional')) {
    fieldPresent = extractBits(buffer, offset, 1);
    offset += 1;
  }
  if (!fieldPresent) return { field: {}, offset: offset };
  if (!Object.hasOwn(parser, field.type)) {
    throw new Error(`No handler defined for field type ${field.type}`);
  }
  return parser[field.type](field, buffer, offset);
}

/**
 * Append the common field properties/metadata
 * @param {Field} field 
 * @param {any} value 
 * @param {number} offset 
 * @returns An object with the meta/wrapper and decoded value
 */
function parseCommon(field, value, offset) {
  const common = { name: field.name };
  if (Object.hasOwn(field, 'description')) {
    common.description = field.description;
  }
  common.type = field.type.replace('Field', '');
  common.value = value;
  return { field: common, offset: offset };
}

/**
 * Get the length of a variable size field
 * @param {Buffer} buffer 
 * @param {number} offset 
 * @returns Object with length of field and new bit offset in buffer
 */
function parseFieldLength(buffer, offset) {
  const lFlag = extractBits(buffer, offset, 1);
  offset += 1;
  const lLen = lFlag ? 15 : 7;
  return {
    length: extractBits(buffer, offset, lLen),
    newOffset: offset + lLen,
  };
}

/**
 * Decode a boolean field
 * @param {Field} field The field definition
 * @param {Buffer} buffer The raw payload buffer
 * @param {number} offset The start bit of the field in the buffer
 * @returns 
 */
function parseBoolField(field, buffer, offset) {
  const value = extractBits(buffer, offset, 1) ? true : false;
  return parseCommon(field, value, offset + 1);
}

/**
 * Decode an enum field
 * @param {Field} field The field definition
 * @param {Buffer} buffer The raw payload buffer
 * @param {number} offset The start bit of the field in the buffer
 * @returns 
 */
function parseEnumField(field, buffer, offset) {
  const enumerations = field.items;
  if (!Array.isArray(enumerations) || enumerations.length < 1) {
    throw new Error('Invalid items for enumeration');
  } else if (!field.size) {
    throw new Error('Invalid size of enumeration');
  }
  const value = enumerations[extractBits(buffer, offset, field.size)];
  return parseCommon(field, value, offset + field.size);
}

/**
 * Decode a data field
 * @param {Field} field The field definition
 * @param {Buffer} buffer The raw payload buffer
 * @param {number} offset The start bit of the field in the buffer
 * @returns 
 */
function parseDataField(field, buffer, offset) {
  let dataLen = field.size;
  if (Object.hasOwn(field, 'fixed') && !field.fixed) {
    const { length, newOffset } = parseFieldLength(buffer, offset);
    dataLen = length;
    offset = newOffset;
  }
  const value = extractBits(buffer, offset, 8*dataLen, true);
  return parseCommon(field, value, offset + 8*dataLen);
}

/**
 * Decode a string field
 * @param {Field} field The field definition
 * @param {Buffer} buffer The raw payload buffer
 * @param {number} offset The start bit of the field in the buffer
 * @returns 
 */
function parseStringField(field, buffer, offset) {
  const { field: parsed, newOffset } = parseDataField(field, buffer, offset);
  parsed.value = parsed.value.toString();
  return parseCommon(field, value, newOffset);
}

/**
 * Decode an unsigned integer field
 * @param {Field} field The field definition
 * @param {Buffer} buffer The raw payload buffer
 * @param {number} offset The start bit of the field in the buffer
 * @returns 
 */
function parseUintField(field, buffer, offset) {
  const value = extractBits(buffer, offset, field.size);
  return parseCommon(field, value, offset + field.size);
}

/**
 * Decode a signed integer field
 * @param {Field} field The field definition
 * @param {Buffer} buffer The raw payload buffer
 * @param {number} offset The start bit of the field in the buffer
 * @returns 
 */
function parseIntField(field, buffer, offset) {
  let value = extractBits(buffer, offset, field.size);
  if ((value & (1 << (field.size - 1))) != 0) {
    value = value - (1 << field.size);
  }
  return parseCommon(field, value, offset + field.size);
}

/**
 * Decode an array field
 * @param {Field} field The field definition
 * @param {Buffer} buffer The raw payload buffer
 * @param {number} offset The start bit of the field in the buffer
 * @returns 
 */
function parseArrayField(field, buffer, offset) {
  let arrLen = field.size;
  if (!field.fixed) {
    const { length, newOffset } = parseFieldLength(buffer, offset);
    arrLen = length;
    offset = newOffset;
  }
  const value = [];
  for (let row = 0; row < arrLen; row++) {
    const decodedColumns = {};
    for (column of field.fields) {
      let columnPresent = true;
      if (Object.hasOwn(column, 'optional')) {
        columnPresent = extractBits(buffer, offset, 1);
        offset += 1;
      }
      if (!columnPresent) { continue; }
      const { field: decodedColumn, offset: newOffset } =
          parseField(column, buffer, offset);
      if (!terseCodec) {
        decodedColumns[column.name] = decodedColumn;
      } else {
        decodedColumns[column.name] = decodedColumn.value;
      }
      offset = newOffset;
    }
    if (decodedColumns) { value.push(decodedColumns); }
  }
  return parseCommon(field, value, offset);
}

function camelCase(original, skip_caps = false) {
  if (typeof original != 'string') throw new Error('Invalid string input');
  if (original.toUpperCase() === original && skip_caps) return original;
  const words = original.match(/[A-Z][a-z]+/g);
  if (words === null) return original;
  words[0] = words[0].toLowerCase();
  return words.join('');
}

function convertCodec(obj) {
  try {
    if (typeof obj != 'object' || obj === null) return obj;
    if (Array.isArray(obj)) {
      if (!obj.every((el) => (typeof el === 'object' && el != null))) {
        return obj;
      }
      for (const i = 0; i < obj.length; i++) {
        obj[i] = convertCodec(obj[i]);
      }
    }
    for (let [key, value] of Object.entries(obj)) {
      const listKeys = ['Services', 'ForwardMessages', 'ReturnMessages', 'Fields'];
      if (listKeys.includes(key)) {
        let subKey = key.includes('Message') ? 'Message' : key.slice(0, -1);
        const newKey = key in substitutions ? substitutions[key] : camelCase(key);
        obj[newKey] = [];
        if (Array.isArray(value[subKey])) {
          for (let x of value[subKey]) {
            obj[newKey].push(convertCodec(x));
          }
        } else {
          if (typeof value[subKey] != 'undefined') {
            obj[newKey].push(convertCodec(value[subKey]));
          }
        }
        delete obj[key];
      } else {
        if (typeof value === 'object' && value !== null) {
          value = convertCodec(value);
        } else if (value in substitutions) {
          value = substitutions[value];
        }
        let newKey;
        if (Object.hasOwn(substitutions, key)) {
          newKey = substitutions[key];
        } else {
          newKey = camelCase(key);
        }
        if (newKey != key) {
          const intFields = ['size'];
          const boolFields = ['optional', 'fixed'];
          if (intFields.includes(newKey)) {
            value = parseInt(value);
          } else if (boolFields.includes(newKey)) {
            value = (value.toLowerCase() === 'true');
          }
          obj[newKey] = value;
          delete obj[key];
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  return obj;
}

/**
 * Decode a message from its raw payload using a JSON codec
 * @param {number[]|Buffer} rawPayload A decimal array of bytes sent over the air
 * @param {Codec} codec A JSON codec/file
 * @param {boolean} [isMo] Indicates if the message was Mobile-Originated
 * @returns A decoded message object
 */
function decodeMessage(rawPayload, codec, isMo = true) {
  if ((!Array.isArray(rawPayload) && !Buffer.isBuffer(rawPayload)) ||
      rawPayload.length < 2 ||
      !rawPayload.every((e => { return 0 <= e <= 255 }))) {
    throw new Error('Invalid raw payload must be integer byte values');
  }
  if (typeof codec === 'string' && fs.existsSync(codec)) {
    try {
      const data = fs.readFileSync(codec);
      if (codec.endsWith('.xml') || codec.endsWith('.idpmsg')) {
        codec = JSON.parse(xmlParser.toJson(data));
        codec = convertCodec(codec);
      } else {
        codec = JSON.parse(data);
      }
    } catch (err) {
      throw new Error(`Invalid codec file ${codec}`);
    }
  }
  if (Object.hasOwn(codec, 'messageDefinition')) {
    codec = codec.messageDefinition;
  }
  if (!Object.hasOwn(codec, 'services') || !Array.isArray(codec.services)) {
    throw new Error('Invalid codec');
  }
  const codecServiceId = rawPayload[0];
  const codecMessageId = rawPayload[1];
  const decoded = {};
  for (const service of codec.services) {
    if (service.codecServiceId != codecServiceId) { continue; }
    const mKey = `mobile${isMo ? 'Originated' : 'Terminated'}Messages`;
    for (const message of service[mKey]) {
      if (message.codecMessageId != codecMessageId) { continue; }
      const buffer = Buffer.from(rawPayload);
      decoded.name = message.name;
      if (message.description) { decoded.description = message.description; }
      decoded.codecServiceId = codecServiceId;
      decoded.codecMessageId = codecMessageId;
      let offset = 16;   // Begin parsing after codec header (SIN, MIN)
      const decodedFields = [];
      for (const field of message.fields) {
        const { field: decodedField, offset: newOffset } =
            parseField(field, buffer, offset);
        offset = newOffset;
        if (decodedField) { decodedFields.push(decodedField); }
      }
      decoded.fields = decodedFields;
      break;   // message found
    }
    break;   // service found
  }
  return decoded;
}

module.exports = {
  decodeMessage,
};