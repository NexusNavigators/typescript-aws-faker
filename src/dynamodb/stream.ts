import { randomUUID } from 'crypto'
import { DynamoDBRecord } from 'aws-lambda'
import { AttributeValue, StreamRecord } from 'aws-lambda/trigger/dynamodb-stream'

import { marshallOptions } from '@aws-sdk/util-dynamodb'
import { marshalItem } from './marshaller'

export interface CustomStreamRecord<
  KeysType extends Record<string, any>,
  OldImageType extends KeysType = KeysType,
  NewImageType extends OldImageType = OldImageType,
> extends Omit<StreamRecord, 'Keys' | 'OldImage' | 'NewImage'> {
  Keys: KeysType
  OldImage: OldImageType
  NewImage: NewImageType
}

export const createStreamRecord = ({
  ApproximateCreationDateTime = Date.now(),
  Keys,
  NewImage,
  OldImage,
  SequenceNumber,
  SizeBytes,
  StreamViewType = 'NEW_AND_OLD_IMAGES',
}: Partial<StreamRecord> = {}): StreamRecord => ({
  ApproximateCreationDateTime,
  Keys,
  NewImage,
  OldImage,
  SequenceNumber,
  SizeBytes,
  StreamViewType,
})

export const createCustomStreamRecord = <
  KeysType extends Record<string, any>,
  OldImageType extends KeysType = KeysType,
  NewImageType extends OldImageType = OldImageType,
> (
  {
    Keys,
    NewImage,
    OldImage,
    ...streamRecord
  }: Partial<CustomStreamRecord<KeysType, OldImageType, NewImageType>> = {},
  options: marshallOptions = { removeUndefinedValues: true },
): StreamRecord => createStreamRecord({
  ...streamRecord,
  Keys: Keys && marshalItem(Keys, options) as { [key: string]: AttributeValue },
  NewImage: NewImage && marshalItem(NewImage, options) as { [key: string]: AttributeValue },
  OldImage: OldImage && marshalItem(OldImage, options) as { [key: string]: AttributeValue },
})

export const createDynamoDBRecord = ({
  awsRegion = 'us-east-1',
  dynamodb,
  eventID = randomUUID(),
  eventName = 'INSERT',
  eventSourceARN,
  eventVersion = '1.1',
  userIdentity,
}: Partial<Omit<DynamoDBRecord, 'eventSource'>> = {}): DynamoDBRecord => ({
  awsRegion,
  eventSource: 'aws:dynamodb',
  dynamodb: createStreamRecord(dynamodb),
  eventID,
  eventName,
  eventSourceARN,
  eventVersion,
  userIdentity,
})
