import { randomUUID } from 'crypto'
import type {
  KinesisStreamEvent,
  KinesisStreamRecord,
  KinesisStreamRecordPayload,
} from 'aws-lambda'
import type { PartialServiceArn } from '../account/index.ts'
import { buildARNString } from '../account/index.ts'

export type KinesisDataType = string | object | undefined

export interface PartialKinesisStreamRecordPayload<T extends KinesisDataType = KinesisDataType>
  extends Partial<Omit<KinesisStreamRecordPayload, 'data'>> {
  data?: T
}

export interface PartialKinesisStreamRecord<T extends KinesisDataType = KinesisDataType>
  extends Partial<Omit<KinesisStreamRecord, 'kinesis' | 'eventSource' | 'eventName' | 'eventSourceARN'>> {
  kinesis?: PartialKinesisStreamRecordPayload<T>
  eventSource?: PartialServiceArn
}

export const createKinesisStreamRecordPayload = <T extends KinesisDataType = KinesisDataType>(
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

export const createKinesisStreamRecord = <T extends KinesisDataType = KinesisDataType>(
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

export const createKinesisStreamEvent = <T extends KinesisDataType = KinesisDataType>(
  records: PartialKinesisStreamRecord<T>[] = [],
): KinesisStreamEvent => {
  return {
    Records: records.map(createKinesisStreamRecord),
  }
}
