/**
 * Binary to JSON codec for Non-IP Modems compatible with ORBCOMM/IDP waveform
 * **DEPRECATED** use `./codecs/nimo/message` instead
 */
const { decodeMessage, encodeMessage } = require('./codecs/nimo/message');
module.exports = {
  decodeMessage,
  encodeMessage,
};

// const fs = require('fs');
// const bitwise = require('bitwise');
// const xmlParser = require('xml2json');

// const decoders = {
//   'arrayField': decodeArrayField,
//   'boolField': decodeBoolField,
//   'dataField': decodeDataField,
//   'enumField': decodeEnumField,
//   'intField': decodeIntField,
//   'stringField': decodeStringField,
//   'uintField': decodeUintField,
// };

// const encoders = {
//   'arrayField': encodeArrayField,
//   'boolField': encodeBoolField,
//   'dataField': encodeDataField,
//   'enumField': encodeEnumField,
//   'intField': encodeIntField,
//   'stringField': encodeStringField,
//   'uintField': encodeUintField,
// };

// const substitutions = {
//   SIN: 'codecServiceId',
//   MIN: 'codecMessageId',
//   'xsi:type': 'type',
//   ForwardMessages: 'mobileTerminatedMessages',
//   ReturnMessages: 'mobileOriginatedMessages',
//   ArrayField: 'arrayField',
//   BooleanField: 'boolField',
//   DataField: 'dataField',
//   EnumField: 'enumField',          
//   UnsignedIntField: 'uintField',
//   SignedIntField: 'intField',
// };

// /**
//  * @typedef Field
//  * @property {string} name The field name (unique among parent fields)
//  * @property {string} type The type of data represented
//  * @property {string} [description] Optional description of purpose/use
//  * @property {boolean} [optional] Optional flag indicating presence
//  * @property {boolean} [fixed] Optional flag indicating fixed size
//  * @property {boolean} [dmask] True passes uint value to next fixed field size
//  * @property {number} [size] Semi-optional (max) size in bits/bytes/elements
//  * @property {string[]} [items] (Enum only) array of enum values
//  * @property {Field[]} [fields] (Array only) sub-fields/columns for an array
//  * @property {any} [default] Optional default value if not populated
//  */

// /**
//  * @typedef Message
//  * @property {string} name
//  * @property {string} [description]
//  * @property {number} codecMessageId
//  * @property {Field[]} fields
//  */

// /**
//  * @typedef Service
//  * @property {string} name
//  * @property {string} [description]
//  * @property {number} codecServiceId
//  * @property {Message[]} [mobileOriginatedMessages]
//  * @property {Message[]} [mobileTerminatedMessages]
//  */

// /**
//  * @typedef Codec
//  * @property {string} [name]
//  * @property {string} [description]
//  * @property {string} [version]
//  * @property {Service[]} services
//  */

// /**
//  * Read a subset of bits from a data Buffer
//  * @param {Buffer} buffer The raw payload buffer
//  * @param {number} offset The bit offset to start reading from
//  * @param {number} length The number of bits to read
//  * @param {boolean} bytes If true return a Buffer instead of number
//  * @returns A number or Buffer of the bits read
//  */
// function extractBits(buffer, offset, length, bytes = false) {
//   if (!Buffer.isBuffer(buffer)) throw new Error('Invalid data buffer');
//   if (offset + length > 8*buffer.length) throw new Error('Invalid bit range');
//   if (typeof bytes != 'boolean') bytes = false;
//   if (length < 2**32 && !bytes) {
//     return bitwise.buffer.readUInt(buffer, offset, length);
//   }
//   return bitwise.buffer.create(bitwise.buffer.read(buffer, offset, length));
// }

// /**
//  * Decode a field to an object
//  * @param {Field} field The field definition
//  * @param {boolean} [field.optional] Optional flag indicating optional presence
//  * @param {Buffer} buffer The raw payload buffer
//  * @param {number} offset The starting bit of the field in the buffer
//  * @returns A decoded field object
//  */
// function parseField(field, buffer, offset, dsize) {
//   let fieldPresent = 1;
//   if (Object.hasOwn(field, 'optional')) {
//     fieldPresent = extractBits(buffer, offset, 1);
//     offset += 1;
//   }
//   if (!fieldPresent) return { field: {}, offset: offset };
//   if (!Object.hasOwn(decoders, field.type)) {
//     throw new Error(`No handler defined for field type ${field.type}`);
//   }
//   return decoders[field.type](field, buffer, offset, dsize);
// }

// /**
//  * Append the common field properties/metadata
//  * @param {Field} field The field definition
//  * @param {string} field.name The field name
//  * @param {string} field.type The field type
//  * @param {string} [field.description] Optonal descriptor for the field
//  * @param {any} value 
//  * @param {number} offset 
//  * @returns An object with the meta/wrapper and decoded value
//  */
// function parseCommon(field, value, offset) {
//   const common = { name: field.name };
//   if (Object.hasOwn(field, 'description')) {
//     common.description = field.description;
//   }
//   common.type = field.type.replace('Field', '');
//   common.value = value;
//   let dmask;
//   if (field.dmask) {
//     const bits = dec2bits(value, field.size);
//     dmask = 0;
//     bits.forEach((bit) => dmask += bit);
//   }
//   return { field: common, offset: offset, dmask: dmask };
// }

// /**
//  * Get the length of a variable size field
//  * @param {Buffer} buffer 
//  * @param {number} offset 
//  * @returns Object with length of field and new bit offset in buffer
//  */
// function parseFieldLength(buffer, offset) {
//   const lFlag = extractBits(buffer, offset, 1);
//   offset += 1;
//   const lLen = lFlag ? 15 : 7;
//   return {
//     length: extractBits(buffer, offset, lLen),
//     newOffset: offset + lLen,
//   };
// }

// /**
//  * Decode a boolean field
//  * @param {Field} field The field definition
//  * @param {Buffer} buffer The raw payload buffer
//  * @param {number} offset The start bit of the field in the buffer
//  * @returns 
//  */
// function decodeBoolField(field, buffer, offset) {
//   const value = extractBits(buffer, offset, 1) ? true : false;
//   return parseCommon(field, value, offset + 1);
// }

// /**
//  * Decode an enum field
//  * @param {Field} field The field definition
//  * @param {string[]} field.items The list of enumeration strings
//  * @param {Buffer} buffer The raw payload buffer
//  * @param {number} offset The start bit of the field in the buffer
//  * @returns 
//  */
// function decodeEnumField(field, buffer, offset) {
//   const enumerations = field.items;
//   if (!Array.isArray(enumerations) || enumerations.length < 1) {
//     throw new Error('Invalid items for enumeration');
//   } else if (!field.size) {
//     throw new Error('Invalid size of enumeration');
//   }
//   const value = enumerations[extractBits(buffer, offset, field.size)];
//   return parseCommon(field, value, offset + field.size);
// }

// /**
//  * Decode a data field
//  * @param {Field} field The field definition
//  * @param {Buffer} buffer The raw payload buffer
//  * @param {number} offset The start bit of the field in the buffer
//  * @returns 
//  */
// function decodeDataField(field, buffer, offset) {
//   let dataLen = field.size;
//   if (Object.hasOwn(field, 'fixed') && !field.fixed) {
//     const { length, newOffset } = parseFieldLength(buffer, offset);
//     dataLen = length;
//     offset = newOffset;
//   }
//   const value = extractBits(buffer, offset, 8*dataLen, true);
//   return parseCommon(field, value, offset + 8*dataLen);
// }

// /**
//  * Decode a string field
//  * @param {Field} field The field definition
//  * @param {Buffer} buffer The raw payload buffer
//  * @param {number} offset The start bit of the field in the buffer
//  * @returns 
//  */
// function decodeStringField(field, buffer, offset) {
//   const { field: parsed, newOffset } = decodeDataField(field, buffer, offset);
//   parsed.value = parsed.value.toString();
//   return parseCommon(field, value, newOffset);
// }

// /**
//  * Decode an unsigned integer field
//  * @param {Field} field The field definition
//  * @param {Buffer} buffer The raw payload buffer
//  * @param {number} offset The start bit of the field in the buffer
//  * @returns 
//  */
// function decodeUintField(field, buffer, offset) {
//   const value = extractBits(buffer, offset, field.size);
//   return parseCommon(field, value, offset + field.size);
// }

// /**
//  * Decode a signed integer field
//  * @param {Field} field The field definition
//  * @param {Buffer} buffer The raw payload buffer
//  * @param {number} offset The start bit of the field in the buffer
//  * @returns 
//  */
// function decodeIntField(field, buffer, offset) {
//   let value = extractBits(buffer, offset, field.size);
//   if ((value & (1 << (field.size - 1))) != 0) {
//     value = value - (1 << field.size);
//   }
//   return parseCommon(field, value, offset + field.size);
// }

// /**
//  * Decode an array field
//  * @param {Field} field The field definition
//  * @param {Field[]} field.fields The fields of the array
//  * @param {Buffer} buffer The raw payload buffer
//  * @param {number} offset The start bit of the field in the buffer
//  * @returns 
//  */
// function decodeArrayField(field, buffer, offset, dsize) {
//   let length = dsize || field.size;
//   if (!field.fixed && !dsize) {
//     ({ length, offset } = parseFieldLength(buffer, offset));
//   }
//   const value = [];
//   for (let row = 0; row < length; row++) {
//     const decodedColumns = [];
//     for (column of field.fields) {
//       let columnPresent = true;
//       if (Object.hasOwn(column, 'optional')) {
//         columnPresent = extractBits(buffer, offset, 1);
//         offset += 1;
//       }
//       if (!columnPresent) { continue; }
//       const { field: decodedColumn, offset: newOffset } =
//           parseField(column, buffer, offset);
//       decodedColumns.push(decodedColumn);
//       offset = newOffset;
//     }
//     if (decodedColumns) { value.push(decodedColumns); }
//   }
//   return parseCommon(field, value, offset);
// }

// /**
//  * Converts a number to a bitwise-compatible Array of bits
//  * @param {number} dec The number to convert
//  * @param {number} nBits The number of bits to use
//  * @returns {Array<0|1>}
//  */
// function dec2bits(dec, nBits) {
//   let arrBitwise = [];
//   for (let i = 0; i < nBits; i++) {
//     const bit = dec & (1 << i);
//     arrBitwise.push(bit === 0 ? 0 : 1);
//   }
//   arrBitwise = arrBitwise.reverse();
//   return arrBitwise;
// }

// /**
//  * Appends bits to a buffer at an offset.
//  * Extends the buffer if required.
//  * @param {Array<0|1>} bits The bitwise `bits` to append
//  * @param {Buffer} buffer The buffer to append to
//  * @param {number} offset The bit offset to append at
//  * @returns 
//  */
// function appendBits(bits, buffer, offset) {
//   if (offset + bits.length > 8 * buffer.length) {
//     const extraBytes = Math.ceil((offset + bits.length - 8 * buffer.length) / 8);
//     for (let i = 0; i < extraBytes; i++) {
//       const x = bitwise.buffer.create([0,0,0,0,0,0,0,0]);
//       buffer = Buffer.concat([buffer, x]);
//     }
//   }
//   bitwise.buffer.modify(buffer, bits, offset);
//   return { buffer: buffer, offset: offset + bits.length };
// }

// /**
//  * Appends bytes to a buffer at a bit offset, extending the buffer if required.
//  * @param {Buffer} bytes The bytes to append
//  * @param {Buffer} buffer The buffer to append to
//  * @param {number} offset The bit offset to append at
//  */
// function appendBytes(bytes, buffer, offset) {
//   if (!Buffer.isBuffer(bytes)) throw new Error('Invalid buffer');
//   if (offset % 8 != 0) {
//     let bits = [];
//     for (const b of bytes.values()) {
//       bits = bits.concat(bitwise.byte.read(b));
//     }
//     ({buffer, offset} = appendBits(bits, buffer, offset));
//   } else {
//     buffer = Buffer.concat([buffer, bytes]);
//     offset += bytes.length * 8;
//   }
//   return { buffer: buffer, offset: offset };
// }

// /**
//  * Appends the field length `L` to the buffer
//  * @param {number} size The field size
//  * @param {Buffer} buffer The buffer to append to
//  * @param {number} offset The bit offset to append at
//  * @returns 
//  */
// function encodeFieldLength(size, buffer, offset) {
//   let bits = dec2bits(size, size < 128 ? 8 : 16);
//   if (size > 127) bits[0] = 1;
//   ({buffer, offset} = appendBits(bits, buffer, offset));
//   return { buffer: buffer, offset: offset };
// }

// function encodeField(field, value, buffer, offset) {
//   if (Object.hasOwn(field, 'optional')) {
//     if (field.optional != false) {
//       const present = typeof value != 'undefined' ? 1 : 0;
//       ({buffer, offset} = appendBits([present], buffer, offset));
//     }
//   }
//   ({buffer, offset} = encoders[field.type](field, value, buffer, offset));
//   return { buffer: buffer, offset: offset };
// }

// function encodeBoolField(field, value, buffer, offset) {
//   if (typeof value != 'boolean') throw new Error('Invalid boolean value');
//   ({buffer, offset} = appendBits([value ? 1 : 0], buffer, offset));
//   return { buffer: buffer, offset: offset };
// }

// function encodeEnumField(field, value, buffer, offset) {
//   if (typeof value === 'string' && field.items.includes(value)) {
//     value = field.items.indexOf(value);
//   }
//   if (typeof value === 'number' && 0 <= value < field.items.length) {
//     ({buffer, offset} = appendBits(dec2bits(value, field.size), buffer, offset));
//     return { buffer: buffer, offset: offset };
//   } else {
//     throw new Error('Invalid enum value');
//   }
// }

// function encodeUintField(field, value, buffer, offset) {
//   if (typeof value != 'number' || value < 0 || value > (2**field.size - 1)) {
//     throw new Error('Invalid unsigned integer value for size');
//   }
//   ({buffer, offset} = appendBits(dec2bits(value, field.size), buffer, offset));
//   return { buffer: buffer, offset: offset };
// }

// function encodeIntField(field, value, buffer, offset) {
//   if (typeof value != 'number' ||
//       value < -(2**field.size) || value > (2**field.size -1)) {
//     throw new Error('Invalid signed integer value for size');
//   }
//   ({buffer, offset} = appendBits(dec2bits(value, field.size), buffer, offset));
//   return { buffer: buffer, offset: offset };
// }

// function encodeStringField(field, value, buffer, offset) {
//   if (typeof value != 'string') throw new Error('Invalid string');
//   if (value.length > field.size) throw new Error('String too long for field size');
//   let pad;
//   if (field.fixed && value.length < field.size) {
//     pad = field.size - value.length;
//   }
//   let te = new TextEncoder();
//   let bytes = Buffer.from(te.encode(value));
//   if (pad) {
//     let padBuf = Buffer.from(Array(pad).fill(0));
//     bytes = Buffer.concat([bytes, padBuf]);
//   }
//   ({buffer, offset} = encodeFieldLength(bytes.length, buffer, offset));
//   ({buffer, offset} = appendBytes(bytes, buffer, offset));
//   return { buffer: buffer, offset: offset };
// }

// function encodeDataField(field, value, buffer, offset) {
//   if (!Buffer.isBuffer(value)) throw new Error('Invalid data buffer');
//   if (value.length > field.size) throw new Error('Data too long for field size');
//   let pad;
//   if (field.fixed && value.length < field.size) {
//     pad = field.size - value.length;
//   }
//   if (pad) {
//     let padBuf = Buffer.from(Array(pad).fill(0));
//     bytes = Buffer.concat([bytes, padBuf]);
//   }
//   ({buffer, offset} = encodeFieldLength(bytes.length, buffer, offset));
//   ({buffer, offset} = appendBytes(bytes, buffer, offset));
//   return { buffer: buffer, offset: offset };
// }

// function defaultFieldValue(field) {
//   if (Object.hasOwn(field, 'default')) return field.default;
//   if (field.type === 'boolField') return false;
//   const zeros = ['enumField', 'intField', 'uintField'];
//   if (zeros.includes(field.type)) return 0;
//   if (field.type === 'string') return '';
//   if (field.type === 'data') return Buffer.from([0]);
// }

// function encodeArrayField(field, value, buffer, offset) {
//   if (!Array.isArray(value)) throw new Error('Invalid array');
//   if (value.length > field.size) throw new Error('Array to large for field size');
//   ({buffer, offset} = encodeFieldLength(field.fixed ? field.size : value.length));
//   value.forEach((el, i) => {
//     field.fields.forEach((f, j) => {
//       ({buffer, offset} = encodeField(f, el[j], ));
//     });
//   });
//   if (field.fixed && value.length < field.size) {
//     for (let i = value.length - 1; i < field.size; i++) {
//       for (const f of field.fields) {
//         ({buffer, offset} = encodeField(f, defaultFieldValue(f), buffer, offset));
//       }
//     }
//   }
//   return { buffer: buffer, offset: offset };
// }

// function camelCase(original, skip_caps = false) {
//   if (typeof original != 'string') throw new Error('Invalid string input');
//   if (original.toUpperCase() === original && skip_caps) return original;
//   const words = original.match(/[A-Z][a-z]+/g);
//   if (words === null) return original;
//   words[0] = words[0].toLowerCase();
//   return words.join('');
// }

// function legacyMdfToCodec(obj) {
//   try {
//     if (typeof obj != 'object' || obj === null) return obj;
//     if (Array.isArray(obj)) {
//       if (!obj.every((el) => (typeof el === 'object' && el != null))) {
//         return obj;
//       }
//       for (let i = 0; i < obj.length; i++) {
//         obj[i] = legacyMdfToCodec(obj[i]);
//       }
//     }
//     for (let [key, value] of Object.entries(obj)) {
//       const listKeys = ['Services', 'ForwardMessages', 'ReturnMessages', 'Fields'];
//       if (listKeys.includes(key)) {
//         let subKey = key.includes('Message') ? 'Message' : key.slice(0, -1);
//         const newKey = key in substitutions ? substitutions[key] : camelCase(key);
//         obj[newKey] = [];
//         if (Array.isArray(value[subKey])) {
//           for (let x of value[subKey]) {
//             obj[newKey].push(legacyMdfToCodec(x));
//           }
//         } else {
//           if (typeof value[subKey] != 'undefined') {
//             obj[newKey].push(legacyMdfToCodec(value[subKey]));
//           }
//         }
//         delete obj[key];
//       } else {
//         if (typeof value === 'object' && value !== null) {
//           value = legacyMdfToCodec(value);
//         } else if (value in substitutions) {
//           value = substitutions[value];
//         }
//         let newKey;
//         if (Object.hasOwn(substitutions, key)) {
//           newKey = substitutions[key];
//         } else {
//           newKey = camelCase(key);
//         }
//         if (newKey != key) {
//           const intFields = ['size'];
//           const boolFields = ['optional', 'fixed'];
//           if (intFields.includes(newKey)) {
//             value = parseInt(value);
//           } else if (boolFields.includes(newKey)) {
//             value = (value.toLowerCase() === 'true');
//           }
//           obj[newKey] = value;
//           delete obj[key];
//         }
//       }
//     }
//   } catch (err) {
//     console.error(err);
//   }
//   return obj;
// }

// /**
//  * Imports and basic sanity on the specified codec.
//  * Accepts valid `Codec`, string representation in XML or JSON, or the path
//  * to a valid XML(.idpmsg) or JSON file.
//  * @param {Codec|string} codec Codec object, string or file path
//  * @returns {Codec} valid Codec object
//  * @throws If unable to parse or validate the codec
//  */
// function importCodec(codec) {
//   if (typeof codec === 'string') {
//     if (fs.existsSync(codec)) {
//       try {
//         codec = fs.readFileSync(codec).toString();
//       } catch (err) {
//         throw new Error(`Unable to read file ${codec} (${err})`);
//       }
//     }
//     if (codec.startsWith('<')) {
//       try {
//         const parsed = xmlParser.toJson(codec);
//         codec = legacyMdfToCodec(xmlParser(codec));
//       } catch (err) {
//         throw new Error(`Unable to parse XML codec (${err})`);
//       }
//     } else if (codec.startsWith('{')) {
//       try {
//         codec = JSON.parse(codec);
//       } catch (err) {
//         throw new Error(`Unable to parse JSON codec (${err})`);
//       }
//     } else {
//       throw new Error('Invalid codec must be JSON or XML');
//     }
//   }
//   if (Object.hasOwn(codec, 'messageDefinition')) {
//     codec = codec.messageDefinition;
//   }
//   if (!Object.hasOwn(codec, 'services') || !Array.isArray(codec.services)) {
//     throw new Error('Invalid codec');
//   }
//   return codec;
// }

// /**
//  * Decode a message from its raw payload using a specified codec.
//  * The codec may specify a path to a compliant XML or JSON file,
//  * or be a compliant string or object conforming to `Codec` structure.
//  * @param {number[]|Buffer} rawPayload Decimal bytes or Buffer sent over the air
//  * @param {Codec|string} codec The codec may be a file path, string or object
//  * @param {boolean} [isMo] Indicates if the message was Mobile-Originated
//  * @returns A decoded `Message` or empty object
//  */
// function decodeMessage(rawPayload, codec, isMo = true) {
//   if ((!Array.isArray(rawPayload) && !Buffer.isBuffer(rawPayload)) ||
//       rawPayload.length < 2 ||
//       !rawPayload.every((e => { return 0 <= e <= 255 }))) {
//     throw new Error('Invalid raw payload must be integer byte values');
//   }
//   codec = importCodec(codec);
//   const codecServiceId = rawPayload[0];
//   const codecMessageId = rawPayload[1];
//   const decoded = {};
//   for (const service of codec.services) {
//     if (service.codecServiceId != codecServiceId) { continue; }
//     const mKey = `mobile${isMo ? 'Originated' : 'Terminated'}Messages`;
//     for (const message of service[mKey]) {
//       if (message.codecMessageId != codecMessageId) { continue; }
//       const buffer = Buffer.from(rawPayload);
//       decoded.name = message.name;
//       if (message.description) { decoded.description = message.description; }
//       decoded.codecServiceId = codecServiceId;
//       decoded.codecMessageId = codecMessageId;
//       let offset = 16;   // Begin parsing after codec header (SIN, MIN)
//       const decodedFields = [];
//       let skip = false;
//       let dsize = undefined;
//       for (const field of message.fields) {
//         if (skip) {
//           skip = false;
//           continue;
//         }
//         const { field: decodedField, offset: newOffset, dmask } =
//             parseField(field, buffer, offset, dsize);
//         offset = newOffset;
//         if (typeof dmask === 'number') {
//           if (dmask === 0) {
//             skip = true;
//           } else {
//             dsize = dmask;
//           }
//         } else {
//           dsize = undefined;
//         }
//         if (decodedField) { decodedFields.push(decodedField); }
//       }
//       decoded.fields = decodedFields;
//       break;   // message found
//     }
//     break;   // service found
//   }
//   return decoded;
// }

// function getMessageField(message, field) {
//   for (const f of message.fields) {
//     if (f.name === field.name) return f;
//   }
// }

// /**
//  * Encode a `Message` object to a bytes buffer using the specified codec.
//  * @param {Message} message The `Message` object to encode
//  * @param {Codec|string} codec The `Codec` or file path to use
//  * @param {boolean} isMo Set if the message is Mobile-Originated (default false)
//  * @returns {Buffer} The encoded message buffer
//  * @throws If unable to process the codec or message
//  */
// function encodeMessage(message, codec, isMo = false) {
//   codec = importCodec(codec);
//   let messageCodec;
//   const { codecServiceId, codecMessageId } = message;
//   for (const s of codec.services) {
//     if (s.codecServiceId === codecServiceId) {
//       const mtype = `mobile${isMo ? 'Originated' : 'Terminated'}Messages`; 
//       for (const m of s[mtype]) {
//         if (m.codecMessageId === codecMessageId) {
//           messageCodec = m;
//           break;
//         }
//       }
//       if (messageCodec) break;
//     }
//   }
//   if (!messageCodec) throw new Error('Unable to encode');
//   let buffer = Buffer.from([codecServiceId, codecMessageId]);
//   let offset = 16;
//   for (const field of messageCodec.fields) {
//     const { value } = getMessageField(message, field);
//     if (typeof value != undefined) {
//       ({buffer, offset} = encodeField(field, value, buffer, offset));
//     }
//   }
//   return buffer;
// }

// const testExports = {
//   dec2bits,
//   appendBits,
//   encodeField,
//   encodeFieldLength,
//   encodeArrayField,
//   encodeBoolField,
//   encodeEnumField,
//   encodeDataField,
//   encodeIntField,
//   encodeUintField,
//   encodeStringField,
// };

// module.exports = {
//   decodeMessage,
//   encodeMessage,
//   testExports,
// };