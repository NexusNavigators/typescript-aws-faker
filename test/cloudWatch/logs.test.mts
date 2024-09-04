import { randomUUID } from 'crypto'
import type { CloudWatchLogsDecodedData, CloudWatchLogsLogEvent } from 'aws-lambda'
import zlib from 'zlib'
import { describe, test, expect } from 'vitest'

import {
  createCloudWatchLogsDecodedData,
  createCloudWatchLogsEvent,
  createCloudWatchLogsLogEvent,
  gunzipCloudWatchLogsDecodedData,
  gzipCloudWatchLogsDecodedData,
} from '../../src/cloudWatch/logs.ts'

const defaultMessage: CloudWatchLogsLogEvent = {
  id: '3195310660696698337880902507980421114328961542429EXAMPLE',
  timestamp: 1432826855000,
  message: '{"eventVersion":"1.03","userIdentity":{"type":"Root"}',
}

const demoCompressedData = 'H4sIAAAAAAAAAHWPwQqCQBCGX0Xm7EFtK+smZBEUgXoLCdMhFtKV3akI8d0bLYmibvPPN3wz00CJxmQnTO41whwWQRIctmEcB6sQbFC3CjW3XW8kxpOpP+OC22d1Wml1qZkQGtoMsScxaczKN3plG8zlaHIta5KqWsozoTYw3/djzwhpLwivWFGHGpAFe7DL68JlBUk+l7KSN7tCOEJ4M3/qOI49vMHj+zCKdlFqLaU2ZHV2a4Ct/an0/ivdX8oYc1UVX860fQDQiMdxRQEAAA=='
const demoDecompressedData = {
  messageType: 'DATA_MESSAGE',
  owner: '123456789123',
  logGroup: 'testLogGroup',
  logStream: 'testLogStream',
  subscriptionFilters: [
    'testFilter',
  ],
  logEvents: [
    {
      id: 'eventId1',
      timestamp: 1440442987000,
      message: '[ERROR] First test message',
    },
    {
      id: 'eventId2',
      timestamp: 1440442987001,
      message: '[ERROR] Second test message',
    },
  ],
}

describe('createCloudWatchLogsLogEvent', () => {
  test('will set defaults', () => {
    expect(createCloudWatchLogsLogEvent()).toEqual(defaultMessage)
  })

  test('will override defaults', () => {
    const expected: CloudWatchLogsLogEvent = {
      id: randomUUID(),
      timestamp: Date.now(),
      message: randomUUID(),
      extractedFields: {
        [randomUUID()]: randomUUID(),
      },
    }
    expect(createCloudWatchLogsLogEvent(expected)).toEqual(expected)
  })
})

describe('createCloudWatchLogsDecodedData', () => {
  test('will set defaults', () => {
    expect(createCloudWatchLogsDecodedData()).toEqual({
      owner: '123456789012',
      logGroup: 'logGroup',
      logStream: 'logStream',
      subscriptionFilters: [],
      messageType: 'messageType',
      logEvents: [],
    })
  })

  test('will override defaults', () => {
    const expected: CloudWatchLogsDecodedData = {
      owner: randomUUID(),
      logGroup: randomUUID(),
      logStream: randomUUID(),
      subscriptionFilters: [randomUUID()],
      messageType: randomUUID(),
      logEvents: [defaultMessage],
    }
    expect(createCloudWatchLogsDecodedData({
      ...expected,
      logEvents: [undefined],
    })).toEqual(expected)
  })
})

test('gunzipCloudWatchLogsDecodedData works with demo data', () => {
  expect(gunzipCloudWatchLogsDecodedData(demoCompressedData)).toStrictEqual(demoDecompressedData)
})

test('gzipCloudWatchLogsDecodedData works with demo data', () => {
  const compressed = gzipCloudWatchLogsDecodedData(demoDecompressedData)
  const buffer = Buffer.from(compressed, 'base64')
  const unzipped = zlib.gunzipSync(buffer).toString('utf8')
  expect(JSON.parse(unzipped)).toStrictEqual(demoDecompressedData)
})

test('createCloudWatchLogsEvent will format the event properly', () => {
  const actualEvent = createCloudWatchLogsEvent(demoDecompressedData)
  expect(actualEvent).toEqual({
    awslogs: {
      data: expect.any(String),
    },
  })

  const compressed = actualEvent.awslogs.data
  const buffer = Buffer.from(compressed, 'base64')
  const unzipped = zlib.gunzipSync(buffer).toString('utf8')
  expect(JSON.parse(unzipped)).toStrictEqual(demoDecompressedData)
})
