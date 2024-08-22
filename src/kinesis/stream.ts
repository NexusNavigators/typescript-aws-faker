import { randomUUID } from 'crypto'
import {
  KinesisStreamEvent,
  KinesisStreamRecord,
  KinesisStreamRecordPayload,
} from 'aws-lambda'
import { buildARNString, PartialServiceArn } from '../account'

export type KinesisDataType = string | any

export interface PartialKinesisStreamRecordPayload<T = KinesisDataType>
  extends Partial<Omit<KinesisStreamRecordPayload, 'data'>> {
  data?: T
}

export interface PartialKinesisStreamRecord<T = KinesisDataType>
  extends Partial<Omit<KinesisStreamRecord, 'kinesis' | 'eventSource' | 'eventName' | 'eventSourceARN'>> {
  kinesis?: PartialKinesisStreamRecordPayload<T>
  eventSource?: PartialServiceArn
}

export const createKinesisStreamRecordPayload = <T = KinesisDataType>(
  {
    approximateArrivalTimestamp = Math.floor(Date.now() / 1e3),
    data: rawData,
    kinesisSchemaVersion = '1',
    partitionKey = randomUUID(),
    sequenceNumber = randomUUID(),
  }: PartialKinesisStreamRecordPayload<T> = {},
): KinesisStreamRecordPayload => {
  let data: string
  if (typeof rawData === 'string') {
    data = rawData
  } else {
    data = Buffer.from(JSON.stringify(rawData ?? {})).toString('base64')
  }
  return {
    approximateArrivalTimestamp,
    data,
    kinesisSchemaVersion,
    partitionKey,
    sequenceNumber,
  }
}

export const createKinesisStreamRecord = <T = KinesisDataType>(
  {
    awsRegion = 'us-east-1',
    eventID = randomUUID(),
    eventSource,
    eventVersion = randomUUID(),
    invokeIdentityArn = buildARNString({ service: 'iam', resource: 'role/unknown' }),
    kinesis,
  }: PartialKinesisStreamRecord<T> = {},
): KinesisStreamRecord => {
  return {
    eventSource: 'aws:kinesis',
    eventName: 'aws:kinesis:record',
    awsRegion,
    eventID,
    eventVersion,
    invokeIdentityArn,
    eventSourceARN: buildARNString({ ...eventSource, service: 'kinesis' }),
    kinesis: createKinesisStreamRecordPayload(kinesis),
  }
}

export const createKinesisStreamEvent = <T = KinesisDataType>(
  records: PartialKinesisStreamRecord<T>[] = [],
): KinesisStreamEvent => {
  return {
    Records: records.map(createKinesisStreamRecord),
  }
}
