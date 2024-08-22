import { randomUUID } from 'crypto'

import {
  createKinesisStreamRecordPayload,
  createKinesisStreamRecord,
  PartialKinesisStreamRecordPayload, createKinesisStreamEvent,
} from '../../src/kinesis/stream'
import { buildARNString, createARN } from '../../src/account'
import { describe, test, expect } from 'vitest'

const generateExpectedPayload = (
  {
    approximateArrivalTimestamp = expect.any(Number),
    data: rawData = {},
    kinesisSchemaVersion = '1',
    partitionKey = expect.any(String),
    sequenceNumber = expect.any(String),
  }: PartialKinesisStreamRecordPayload = {},
) => {
  let data = rawData
  if (typeof data === 'string') {
    data = rawData
  }
  else {
    data = Buffer.from(JSON.stringify(data)).toString('base64')
  }
  return {
    approximateArrivalTimestamp,
    kinesisSchemaVersion,
    partitionKey,
    sequenceNumber,
    data,
  }
}

describe('createKinesisStreamRecordPayload', () => {
  test('will create with default values', () => {
    expect(createKinesisStreamRecordPayload()).toStrictEqual(generateExpectedPayload())
  })
  test('can override default values', () => {
    const approximateArrivalTimestamp = Math.floor(Date.now() / 1e3 - 60e3)
    const data = { [randomUUID()]: randomUUID() }
    const kinesisSchemaVersion = randomUUID()
    const partitionKey = randomUUID()
    const sequenceNumber = randomUUID()

    expect(createKinesisStreamRecordPayload({
      approximateArrivalTimestamp,
      data,
      kinesisSchemaVersion,
      partitionKey,
      sequenceNumber,
    }))
      .toStrictEqual(generateExpectedPayload({
        approximateArrivalTimestamp,
        data,
        kinesisSchemaVersion,
        partitionKey,
        sequenceNumber,
      }))
  })

  test('will accept data strings', () => {
    const data = randomUUID()
    expect(createKinesisStreamRecordPayload({
      data,
    })).toStrictEqual(generateExpectedPayload({
      data,
    }))
  })
})

describe('createKinesisStreamRecord', () => {
  test('createKinesisStreamRecord will create with default values', () => {
    expect(createKinesisStreamRecord()).toStrictEqual({
      eventSource: 'aws:kinesis',
      eventName: 'aws:kinesis:record',
      awsRegion: 'us-east-1',
      eventID: expect.any(String),
      eventVersion: expect.any(String),
      invokeIdentityArn: expect.any(String),
      eventSourceARN: expect.any(String),
      kinesis: generateExpectedPayload(),
    })
  })
  test('createKinesisStreamRecord can override default values', () => {
    const awsRegion = randomUUID()
    const eventID = randomUUID()
    const eventVersion = randomUUID()
    const invokeIdentityArn = randomUUID()
    const data = { [randomUUID()]: randomUUID() }
    const eventSource = createARN({ service: 'kinesis' })

    expect(createKinesisStreamRecord({
      awsRegion,
      eventID,
      eventVersion,
      invokeIdentityArn,
      eventSource,
      kinesis: {
        data,
      },
    })).toStrictEqual({
      eventSource: 'aws:kinesis',
      eventName: 'aws:kinesis:record',
      awsRegion,
      eventID,
      eventVersion,
      invokeIdentityArn,
      eventSourceARN: buildARNString(eventSource),
      kinesis: generateExpectedPayload({
        data,
      }),
    })
  })
})

describe('createKinesisStreamEvent', () => {
  test('will create a valid Event', () => {
    expect(createKinesisStreamEvent()).toStrictEqual({ Records: [] })
    expect(createKinesisStreamEvent([{}])).toStrictEqual({
      Records: [{
        eventSource: 'aws:kinesis',
        eventName: 'aws:kinesis:record',
        awsRegion: 'us-east-1',
        eventID: expect.any(String),
        eventVersion: expect.any(String),
        invokeIdentityArn: expect.any(String),
        eventSourceARN: expect.any(String),
        kinesis: generateExpectedPayload(),
      }],
    })
  })
})
