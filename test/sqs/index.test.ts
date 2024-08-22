import { SQSMessageAttributes } from 'aws-lambda/trigger/sqs'
import { createSQSRecordAttributes, createSQSMessageAttributes, createSQSRecord } from '../../src/sqs/event'
import { createHash, randomUUID } from 'crypto'
import { describe, test, expect } from 'vitest'

describe('createSQSRecordAttributes', () => {
  test('will set defaults', () => {
    expect(createSQSRecordAttributes()).toStrictEqual({
      AWSTraceHeader: undefined,
      ApproximateReceiveCount: expect.any(String),
      SentTimestamp: expect.any(String),
      SenderId: expect.any(String),
      ApproximateFirstReceiveTimestamp: expect.any(String),
      SequenceNumber: undefined,
      MessageGroupId: undefined,
      MessageDeduplicationId: undefined,
    })
  })

  test('can override defaults', () => {
    const expected = {
      AWSTraceHeader: randomUUID(),
      ApproximateReceiveCount: randomUUID(),
      SentTimestamp: randomUUID(),
      SenderId: randomUUID(),
      ApproximateFirstReceiveTimestamp: randomUUID(),
      SequenceNumber: randomUUID(),
      MessageGroupId: randomUUID(),
      MessageDeduplicationId: randomUUID(),
    }
    expect(createSQSRecordAttributes(expected)).toStrictEqual(expected)
  })
})

describe('createSQSMessageAttributes', () => {
  test('will set defaults', () => {
    expect(createSQSMessageAttributes()).toStrictEqual({})
  })

  test('can override defaults', () => {
    const attributes: SQSMessageAttributes = {
      keyName: {
        stringValue: randomUUID(),
        dataType: 'String',
        stringListValues: [],
        binaryListValues: [],
      },
    }
    expect(createSQSMessageAttributes(attributes)).toStrictEqual(attributes)
  })
})

describe('createSQSRecord', () => {
  test.each([
    randomUUID(),
    { [randomUUID()]: randomUUID() },
  ])('%# will set defaults', (rawbody) => {
    const body = typeof rawbody === 'string' ? rawbody : JSON.stringify(rawbody)
    expect(createSQSRecord({
      body: rawbody,
    })).toStrictEqual({
      messageId: expect.any(String),
      receiptHandle: expect.any(String),
      awsRegion: 'us-east-1',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:us-east-1:123456789:some-queue-name',
      body,
      md5OfBody: createHash('md5').update(body).digest('hex'),
      attributes: {
        AWSTraceHeader: undefined,
        ApproximateReceiveCount: expect.any(String),
        SentTimestamp: expect.any(String),
        SenderId: expect.any(String),
        ApproximateFirstReceiveTimestamp: expect.any(String),
        SequenceNumber: undefined,
        MessageGroupId: undefined,
        MessageDeduplicationId: undefined,
      },
      messageAttributes: {},
    })
  })

  test('can override defaults', () => {
    const body = randomUUID()
    const messageId = randomUUID()
    const receiptHandle = randomUUID()
    const attributes = createSQSRecordAttributes()
    const messageAttributes = {
      key: {
        stringValue: randomUUID(),
        stringListValues: [],
        binaryListValues: [],
        dataType: 'String',
      },
    }
    const eventSourceARN = randomUUID()
    const awsRegion = randomUUID()
    expect(createSQSRecord({
      body,
      messageId,
      receiptHandle,
      attributes,
      messageAttributes,
      eventSourceARN,
      awsRegion,
    })).toStrictEqual({
      eventSource: 'aws:sqs',
      messageId,
      receiptHandle,
      attributes,
      messageAttributes,
      eventSourceARN,
      awsRegion,
      body,
      md5OfBody: createHash('md5').update(body).digest('hex'),
    })
  })
})
