import {
  CloudWatchLogsEvent,
  CloudWatchLogsLogEvent,
  CloudWatchLogsDecodedData,
} from 'aws-lambda'

import zlib from 'zlib'

export const createCloudWatchLogsLogEvent = (
  {
    id = '3195310660696698337880902507980421114328961542429EXAMPLE',
    timestamp = 1432826855000,
    message = '{"eventVersion":"1.03","userIdentity":{"type":"Root"}',
    extractedFields,
  }: Partial<CloudWatchLogsLogEvent> = {},
): CloudWatchLogsLogEvent => ({
  id,
  timestamp,
  message,
  extractedFields,
})

export type PartialCloudWatchLogsDecodedData = Partial<Omit<CloudWatchLogsDecodedData, 'logEvents'>> & {
  logEvents?: (Partial<CloudWatchLogsLogEvent> | undefined)[]
}

export const createCloudWatchLogsDecodedData = (
  {
    owner = '123456789012',
    logGroup = 'logGroup',
    logStream = 'logStream',
    subscriptionFilters = [],
    messageType = 'messageType',
    logEvents = [],
  }: PartialCloudWatchLogsDecodedData = {},
): CloudWatchLogsDecodedData => ({
  owner,
  logGroup,
  logStream,
  subscriptionFilters,
  messageType,
  logEvents: logEvents.map(createCloudWatchLogsLogEvent),
})

export const gunzipCloudWatchLogsDecodedData = (
  gzipped: string,
): CloudWatchLogsDecodedData => {
  const unzipped = zlib.gunzipSync(Buffer.from(gzipped, 'base64')).toString('utf8')
  return JSON.parse(unzipped) as CloudWatchLogsDecodedData
}

export const gzipCloudWatchLogsDecodedData = (logsData: PartialCloudWatchLogsDecodedData) => {
  return zlib.gzipSync(JSON.stringify(createCloudWatchLogsDecodedData(logsData))).toString('base64')
}

export const createCloudWatchLogsEvent = (rawData: PartialCloudWatchLogsDecodedData): CloudWatchLogsEvent => ({
  awslogs: {
    data: gzipCloudWatchLogsDecodedData(rawData),
  },
})
