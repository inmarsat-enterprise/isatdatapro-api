/**
 * Constants remapping/abstracting native API keys to Javascript camelcase
 */

const SIN = 'codecServiceId';
const MIN = 'codecMessageId';
const ERROR_DEFINITION = {
  'ID': 'errorId',
  'Name': 'name',
  'Description': 'description',
};
const MESSAGE_PAYLOAD_JSON = {
  'IsForward': 'isForward',
  'SIN': SIN,
  'MIN': MIN,
  'Name': 'name',
  'Type': 'dataType',
  'Value': 'stringValue',
  'Elements': 'arrayElements',
  'Index': 'index',
  'Fields': 'fields',
  'Message': 'message',
};
const RETURN_MESSAGE_WRAPPER = {
  'ID': 'messageId',
  'MobileID': 'mobileId',
  'SIN': SIN,
  'RawPayload': 'payloadRaw',
  'Payload': 'payloadJson',
  'ReceiveUTC': 'receiveTimeUtc',
  'MessageUTC': 'mailboxTimeUtc',
  'RegionName': 'satelliteRegion',
  'OTAMessageSize': 'size',
};
const RETURN_MESSAGE = Object.assign(
  {},
  RETURN_MESSAGE_WRAPPER,
  MESSAGE_PAYLOAD_JSON
);
const GET_RETURN_WRAPPER = {
  'ErrorID': 'errorId',
  'More': 'more',
  'NextStartUTC': 'nextStartTimeUtc',
  'NextFromUTC': 'nextFromUtc',
  'NextStartID': 'nextStartId',
  'Messages': 'messages',
};
const GET_RETURN = Object.assign(
  {},
  GET_RETURN_WRAPPER,
  RETURN_MESSAGE
);
const FORWARD_MESSAGE_WRAPPER = {
  'DestinationID': 'mobileId',
  'UserMessageID': 'userMessageId',
  'RawPayload': 'payloadRaw',
  'Payload': 'payloadJson',
};
const FORWARD_MESSAGE = Object.assign(
  {},
  FORWARD_MESSAGE_WRAPPER,
  MESSAGE_PAYLOAD_JSON
);
const SUBMIT_OR_CANCEL_FORWARD = {
  'ErrorID': 'errorId',
  'Submissions': 'submissions',
  'ForwardMessageID': 'messageId',
  'ID': 'messageId',
  'UserMessageID': 'userMessageId',
  'DestinationID': 'mobileId',
  'OTAMessageSize': 'size',
  'StateUTC': 'stateTimeUtc',
  'TerminalWakeupPeriod': 'modemSleepSeconds',
  'ScheduledSendUTC': 'scheduledSendTimeUtc',
  'Cancellations': 'cancellations',
  'CancellationStatus': 'cancellationStatus',
  'CancelRequestID': 'cancelRequestId',
};
const GET_FORWARD_WRAPPER = {
  'ErrorID': 'errorId',
  'Messages': 'messages',
  'DestinationID': 'mobileId',
  'ID': 'messageId',
  'RawPayload': 'payloadRaw',
  'Payload': 'payloadJson',
  'CreateUTC': 'mailboxTimeUtc',
  'StatusUTC': 'stateTimeUtc',
  'State': 'state',
  'ErrorID': 'errorId',
  'IsClosed': 'isClosed',
  'ReferenceNumber': 'referenceNumber',
  'Transport': 'transport',
  'RegionName': 'regionName',
};
const GET_FORWARD = Object.assign(
  {},
  GET_FORWARD_WRAPPER,
  MESSAGE_PAYLOAD_JSON
);
const GET_STATUSES = {
  'ErrorID': 'errorId',
  'More': 'more',
  'NextStartUTC': 'nextStartTimeUtc',
  'Statuses': 'statuses',
  'ID': 'messageId',
  'ForwardMessageID': 'messageId',
  'IsClosed': 'isClosed',
  'ReferenceNumber': 'referenceNumber',
  'StateUTC': 'stateTimeUtc',
  'State': 'state',
  'StatusUTC': 'statusUtc',
  'RegionName': 'regionName',
  'CreateUTC': 'createUtc',
  'Transport': 'transport',
  'Network': 'network',
};
const MOBILE_OR_BROADCAST_INFO = {
  'ErrorID': 'errorId',
  'Mobiles': 'mobiles',
  'Terminals': 'mobiles',
  'BroadcastInfos': 'broadcastGroups',
  'ID': 'mobileId',
  'PrimeID': 'mobileId',
  'Description': 'description',
  'LastRegistrationUTC': 'lastRegistrationTimeUtc',
  'LastRegistrationMessageID': 'lastRegistrationMessageId',
  'LastSatelliteNetwork': 'lastSatelliteNetwork',
  'LastOperationMode': 'lastOperationMode',
  'LastRegionName': 'satelliteRegion',
  'RegionName': 'satelliteRegion',
  'MTSN': 'mtsnId',
  'UpdateUTC': 'updateUtc',
};

module.exports = {
  SIN,
  MIN,
  ERROR_DEFINITION,
  RETURN_MESSAGE,
  GET_RETURN,
  FORWARD_MESSAGE,
  SUBMIT_OR_CANCEL_FORWARD,
  GET_FORWARD,
  GET_STATUSES,
  MOBILE_OR_BROADCAST_INFO,
};
