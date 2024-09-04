import { randomUUID, createHash } from 'crypto'
import type { SQSRecord, SQSRecordAttributes, SQSMessageAttributes } from 'aws-lambda'
import type { PartialServiceArn } from '../account/index.ts'
import { buildARNString, createARN } from '../account/index.ts'

export interface PartialSQSRecord extends Partial<Omit<SQSRecord,
  'attributes'
  | 'messageAttributes'
  | 'body'
  | 'md5OfBody'
  | 'eventSource'
  | 'eventSourceARN'
>> {
  attributes?: Partial<SQSRecordAttributes>
  messageAttributes?: SQSMessageAttributes
  eventSourceARN?: PartialServiceArn
}

export const createSQSRecordAttributes = (
  {
    AWSTraceHeader,
    ApproximateReceiveCount = `${123}`,
    SentTimestamp = `${Date.now()}`,
    SenderId = randomUUID(),
    ApproximateFirstReceiveTimestamp = `${Date.now()}`,
    SequenceNumber,
    MessageGroupId,
    MessageDeduplicationId,
  }: Partial<SQSRecordAttributes> = {},
): SQSRecordAttributes => ({
  AWSTraceHeader,
  ApproximateReceiveCount,
  SentTimestamp,
  SenderId,
  ApproximateFirstReceiveTimestamp,
  SequenceNumber,
  MessageGroupId,
  MessageDeduplicationId,
})

export const createSQSMessageAttributes = (
  attributes: SQSMessageAttributes = {},
): SQSMessageAttributes => attributes

export const createSQSRecord = <T extends object | number | boolean | string = string>(
  {
    messageId = randomUUID(),
    receiptHandle = randomUUID(),
    body: rawBody,
    attributes,
    messageAttributes,
    eventSourceARN = { resource: 'some-queue-name', region: 'us-east-1' },
    awsRegion = 'us-east-1',
  }: PartialSQSRecord & { body: T },
): SQSRecord => {
  let body: string
  if (typeof rawBody === 'string') {
    body = rawBody
  } else {
    body = JSON.stringify(rawBody)
  }
  return {
    messageId,
    receiptHandle,
    body,
    attributes: createSQSRecordAttributes(attributes),
    messageAttributes: createSQSMessageAttributes(messageAttributes),
    md5OfBody: createHash('md5').update(body).digest('hex'),
    eventSource: 'aws:sqs',
    eventSourceARN: buildARNString(createARN({ region: 'us-east-1', ...eventSourceARN, service: 'sqs' })),
    awsRegion,
  }
}
