import { randomUUID } from 'crypto'
import { SQSRecord, SQSRecordAttributes } from 'aws-lambda'
import { SQSMessageAttributes } from 'aws-lambda/trigger/sqs'
import { createHash } from 'crypto'
import { buildARNString, createARN, PartialArn } from '../account'

export type PartialSQSArn = Omit<PartialArn, 'service'>

export interface PartialSQSRecord extends Partial<Omit<SQSRecord,
  'attributes'
  | 'messageAttributes'
  | 'body'
  | 'md5OfBody'
  | 'eventSource'
  | 'eventSourceARN'
>> {
  attributes?: Partial<SQSRecordAttributes>;
  messageAttributes?: SQSMessageAttributes;
  eventSourceARN: PartialSQSArn;
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
    eventSourceARN = { resource: 'some-queue-name' },
    awsRegion = 'us-east-1',
  }: PartialSQSRecord & { body: T },
): SQSRecord => {
  let body: string
  if (typeof rawBody === 'string') {
    body = rawBody
  }
  else {
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
    eventSourceARN: buildARNString(createARN({ ...eventSourceARN , service: 'sqs' })),
    awsRegion,
  }
}
