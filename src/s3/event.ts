import { randomUUID } from 'crypto'
import { S3EventRecord } from 'aws-lambda'
import { buildARNString, PartialServiceArn } from '../account'

export type S3RecordEventType = 'TestEvent'
  | 'ObjectCreated:Put'
  | 'ObjectCreated:Post'
  | 'ObjectCreated:Copy'
  | 'ObjectCreated:CompleteMultipartUpload'
  | 'ObjectRemoved:Delete'
  | 'ObjectRemoved:DeleteMarkerCreated'
  | 'ObjectRestore:Post'
  | 'ObjectRestore:Completed'
  | 'ReducedRedundancyLostObject'
  | 'Replication:OperationFailedReplication'
  | 'Replication:OperationMissedThreshold'
  | 'Replication:OperationReplicatedAfterThreshold'
  | 'Replication:OperationNotTracked'

export type S3Record = S3EventRecord['s3']
export type S3RecordBucket = S3Record['bucket']
export type S3RecordObject = S3Record['object']

export type PartialS3RecordBucket = Partial<Omit<S3RecordBucket, 'name' | 'arn' >> & Pick<S3RecordBucket, 'name'> & {
  arn?: Pick<PartialServiceArn, 'partition'>
}

export type PartialS3RecordObject = Partial<Omit<S3RecordObject, 'key'>> & Pick<S3RecordObject, 'key'>
export interface PartialS3Record extends Partial<Omit<S3Record, 'bucket' | 'object'>> {
  bucket: PartialS3RecordBucket
  object: PartialS3RecordObject
}

export interface PartialS3EventRecord extends Partial<Omit<S3EventRecord, 's3' | 'eventSource' | 'eventName'>> {
  eventName?: S3RecordEventType
  s3: PartialS3Record
}

export const createRecordBucket = (
  {
    name,
    ownerIdentity = {
      principalId: randomUUID(),
    },
    arn: { partition = 'aws' } = { },
  }: PartialS3RecordBucket,
): S3RecordBucket => ({
  name,
  ownerIdentity,
  arn: buildARNString({ partition, service: 's3', resource: name }),
})

export const createRecordObject = (
  {
    key,
    size = 123,
    eTag = randomUUID(),
    versionId,
    sequencer = randomUUID(),
  }: PartialS3RecordObject,
): S3RecordObject => ({
  key,
  size,
  eTag,
  versionId,
  sequencer,
})

export const createRecord = (
  {
    s3SchemaVersion = '1.2.3',
    configurationId = '123',
    bucket,
    object,
  }: PartialS3Record,
): S3Record => ({
  s3SchemaVersion,
  configurationId,
  bucket: createRecordBucket(bucket),
  object: createRecordObject(object),
})

export const createLambdaEventRecord = (
  {
    eventVersion = '123',
    awsRegion = 'us-east-1',
    eventTime = new Date().toISOString(),
    eventName = 'ObjectCreated:Put',
    userIdentity = {
      principalId: randomUUID(),
    },
    requestParameters = {
      sourceIPAddress: randomUUID(),
    },
    responseElements = {
      'x-amz-request-id': randomUUID(),
      'x-amz-id-2': randomUUID(),
    },
    s3,
    glacierEventData,
  }: PartialS3EventRecord,
  partition = 'aws',
): S3EventRecord => ({
  eventVersion,
  eventSource: `${partition}:s3`,
  awsRegion,
  eventTime,
  eventName,
  userIdentity,
  requestParameters,
  responseElements,
  s3: createRecord(s3),
  glacierEventData,
})
