import { randomUUID } from 'crypto'
import {
  createStreamRecord,
  createDynamoDBRecord, createCustomStreamRecord,
} from '../../src/dynamodb/stream'
import { DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { describe, test, expect } from 'vitest'

describe('createCustomStreamRecord', () => {
  test('will set defaults', () => {
    expect(createCustomStreamRecord()).toStrictEqual({
      ApproximateCreationDateTime: expect.any(Number),
      StreamViewType: 'NEW_AND_OLD_IMAGES',
      Keys: undefined,
      NewImage: undefined,
      OldImage: undefined,
      SequenceNumber: undefined,
      SizeBytes: undefined,
    } as StreamRecord)
  })

  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
  test('will marshal Keys, OldImage and NewImage', () => {
    const actual = {
      booleanKey: true,
      listKey: ['Cookies', 'Coffee', 3.14159],
      mapKey: { Name: 'Joe', Age: 35 },
      numberKey: 123.45,
      nullKey: null,
      stringKey: 'Hello',
    }
    const expected = {
      booleanKey: { BOOL: true },
      listKey: { L: [{ S: 'Cookies' }, { S: 'Coffee' }, { N: '3.14159' }] },
      mapKey: { M: { Name: { S: 'Joe' }, Age: { N: '35' } } },
      numberKey: { N: '123.45' },
      nullKey: { NULL: true },
      stringKey: { S: 'Hello' },
    }

    expect(createCustomStreamRecord({
      Keys: actual,
      NewImage: actual,
      OldImage: actual,
    })).toStrictEqual({
      Keys: expected,
      NewImage: expected,
      OldImage: expected,
      ApproximateCreationDateTime: expect.any(Number),
      SequenceNumber: undefined,
      SizeBytes: undefined,
      StreamViewType: 'NEW_AND_OLD_IMAGES',
    })
  })
})

describe('createStreamRecord', () => {
  test('will set defaults', () => {
    expect(createStreamRecord()).toStrictEqual({
      ApproximateCreationDateTime: expect.any(Number),
      StreamViewType: 'NEW_AND_OLD_IMAGES',
      Keys: undefined,
      NewImage: undefined,
      OldImage: undefined,
      SequenceNumber: undefined,
      SizeBytes: undefined,
    } as StreamRecord)
  })

  test('can override defaults', () => {
    const ApproximateCreationDateTime = Date.now() - 360e3
    const StreamViewType: StreamRecord['StreamViewType'] = 'KEYS_ONLY'
    expect(createStreamRecord({
      ApproximateCreationDateTime,
      StreamViewType,
    })).toStrictEqual({
      ApproximateCreationDateTime,
      StreamViewType,
      Keys: undefined,
      NewImage: undefined,
      OldImage: undefined,
      SequenceNumber: undefined,
      SizeBytes: undefined,
    } as StreamRecord)
  })
})

describe('createDynamoDBRecord', () => {
  test('will set defaults', () => {
    expect(createDynamoDBRecord()).toStrictEqual({
      awsRegion: 'us-east-1',
      eventID: expect.any(String),
      eventName: 'INSERT',
      eventSourceARN: undefined,
      eventVersion: '1.1',
      userIdentity: undefined,
      eventSource: 'aws:dynamodb',
      dynamodb: {
        ApproximateCreationDateTime: expect.any(Number),
        StreamViewType: 'NEW_AND_OLD_IMAGES',
        Keys: undefined,
        NewImage: undefined,
        OldImage: undefined,
        SequenceNumber: undefined,
        SizeBytes: undefined,
      },
    } as DynamoDBRecord)
  })

  test('can override defaults', () => {
    const ApproximateCreationDateTime = Date.now() - 360e3
    const StreamViewType: StreamRecord['StreamViewType'] = 'KEYS_ONLY'
    const awsRegion = 'us-west-1'
    const eventID = randomUUID()
    const eventName: DynamoDBRecord['eventName'] = 'REMOVE'
    const eventVersion = '2.3'
    expect(createDynamoDBRecord({
      awsRegion,
      eventID,
      eventName,
      eventVersion,
      dynamodb: {
        ApproximateCreationDateTime,
        StreamViewType,
      },
    })).toStrictEqual({
      awsRegion,
      eventSource: 'aws:dynamodb',
      eventID,
      eventName,
      eventSourceARN: undefined,
      eventVersion,
      userIdentity: undefined,
      dynamodb: {
        ApproximateCreationDateTime,
        StreamViewType,
        Keys: undefined,
        NewImage: undefined,
        OldImage: undefined,
        SequenceNumber: undefined,
        SizeBytes: undefined,
      },
    } as DynamoDBRecord)
  })
})
