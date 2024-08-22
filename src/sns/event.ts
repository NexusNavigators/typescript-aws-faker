import { randomUUID } from 'crypto'
import { SNSEventRecord } from 'aws-lambda'
import { SNSMessage } from 'aws-lambda/trigger/sns'

import { ARN } from '@aws-sdk/util-arn-parser'
import { buildARNString } from '../account'

export type PartialSnsArn = Omit<Partial<ARN>, 'service'>

export type PartialSNSMessage = Omit<Partial<SNSMessage>, 'Message' | 'TopicArn'> & {
  Message?: any
  TopicArn?: PartialSnsArn
}

export type PartialSNSEventRecord = Omit<Partial<SNSEventRecord>, 'Sns' | 'EventSubscriptionArn' | 'EventSource'> & {
  Sns?: PartialSNSMessage
  EventSubscriptionArn?: PartialSnsArn
}

export const createSnsMessage = (
  {
    SignatureVersion = '1',
    Timestamp = new Date().toISOString(),
    Signature = randomUUID(),
    SigningCertUrl = 'https://never.never.never/never.pem',
    MessageId = randomUUID(),
    Message = randomUUID(),
    MessageAttributes = {},
    Type = randomUUID(),
    UnsubscribeUrl = `https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&amp;SubscriptionArn=arn:aws:sns:us-east-1:123456789012:test-lambda:${randomUUID()}`,
    TopicArn = {},
    Subject = randomUUID(),
  }: PartialSNSMessage = {},
): SNSMessage => ({
  SignatureVersion,
  Timestamp,
  Signature,
  SigningCertUrl,
  MessageId,
  Message: typeof Message === 'string' ? Message : JSON.stringify(Message),
  MessageAttributes,
  Type,
  UnsubscribeUrl,
  TopicArn: buildARNString({ ...TopicArn, service: 'sns' }),
  Subject,
})

export const createSNSEventRecord = (
  {
    EventVersion = '1',
    EventSubscriptionArn = {},
    Sns,
  }: PartialSNSEventRecord = {},
): SNSEventRecord => ({
  EventVersion,
  EventSubscriptionArn: buildARNString({ ...EventSubscriptionArn, service: 'sns' }),
  EventSource: 'aws:sns',
  Sns: createSnsMessage(Sns),
})
