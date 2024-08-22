import { randomUUID } from 'crypto'
import { event } from '../../src/sns'
import { SNSMessage } from 'aws-lambda/trigger/sns'
import { PartialSnsArn } from '../../src/sns/event'
import { ARN } from '@aws-sdk/util-arn-parser'
import { buildARNString } from '../../src/account'

const { createSnsMessage, createSNSEventRecord } = event

const partialArn: Omit<ARN, 'service'> = {
  accountId: '123456789012',
  partition: 'aws-gov',
  region: 'us-west-1',
  resource: 'sns-lambda',
}

const message = { [randomUUID()]: randomUUID() }

const snsMessage: Omit<SNSMessage, 'Message' | 'TopicArn'> & {
  Message?: object
  TopicArn?: PartialSnsArn
} = {
  SignatureVersion: '1',
  Timestamp: new Date().toISOString(),
  Signature: randomUUID(),
  SigningCertUrl: 'https://never.never.never/never.pem',
  MessageId: randomUUID(),
  Message: message,
  MessageAttributes: {
    [randomUUID()]: {
      Type: 'String',
      Value: randomUUID(),
    },
  },
  Type: randomUUID(),
  UnsubscribeUrl: `https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&amp;SubscriptionArn=arn:aws:sns:us-east-1:123456789012:test-lambda:${randomUUID()}`,
  TopicArn: partialArn,
  Subject: randomUUID(),
}

const defaultSnsMessage = {
  SignatureVersion: '1',
  Timestamp: expect.any(String),
  Signature: expect.any(String),
  SigningCertUrl: 'https://never.never.never/never.pem',
  MessageId: expect.any(String),
  Message: expect.any(String),
  MessageAttributes: {},
  Type: expect.any(String),
  UnsubscribeUrl: expect.any(String),
  TopicArn: expect.any(String),
  Subject: expect.any(String),
}

describe('createSnsMessage', () => {
  test('will set defaults', () => {
    expect(createSnsMessage()).toStrictEqual(defaultSnsMessage)
    expect(createSnsMessage(
      {},
    )).toStrictEqual(defaultSnsMessage)
  })

  test('can override defaults', () => {
    expect(createSnsMessage(snsMessage)).toStrictEqual({
      ...snsMessage,
      TopicArn: buildARNString({ ...partialArn, service: 'sns' }),
      Message: JSON.stringify(message),
    })
  })
})

describe('createSNSEventRecord', () => {
  test('will set defaults', () => {
    expect(createSNSEventRecord()).toStrictEqual({
      EventVersion: '1',
      EventSubscriptionArn: expect.any(String),
      EventSource: 'aws:sns',
      Sns: defaultSnsMessage,
    })
  })

  test('can override defaults', () => {
    const EventVersion = randomUUID()
    expect(createSNSEventRecord({
      EventVersion,
      EventSubscriptionArn: partialArn,
      Sns: snsMessage,
    })).toStrictEqual({
      EventVersion: EventVersion,
      EventSubscriptionArn: buildARNString({ ...partialArn, service: 'sns' }),
      EventSource: 'aws:sns',
      Sns: {
        ...snsMessage,
        TopicArn: buildARNString({ ...partialArn, service: 'sns' }),
        Message: JSON.stringify(message),
      },
    })
  })
})
