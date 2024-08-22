import { randomUUID } from 'crypto'
import { describe, test, expect } from 'vitest'

import { createRecordBucket, createRecordObject, createRecord, createLambdaEventRecord } from '../../src/s3/event'

describe('createRecordBucket', () => {
  test('will set defaults', () => {
    const name = randomUUID()
    expect(createRecordBucket({ name })).toStrictEqual({
      name,
      ownerIdentity: {
        principalId: expect.any(String),
      },
      arn: `arn:aws:s3:::${name}`,
    })
  })

  test('can override defaults', () => {
    const name = randomUUID()
    const arn = randomUUID()
    const ownerIdentity = {
      principalId: randomUUID(),
    }
    expect(createRecordBucket({
      name,
      ownerIdentity,
      arn,
    })).toStrictEqual({
      name,
      ownerIdentity,
      arn,
    })
  })
})

describe('createS3RecordObject', () => {
  test('will set defaults', () => {
    const key = randomUUID()
    expect(createRecordObject({ key })).toStrictEqual({
      key,
      size: expect.any(Number),
      eTag: expect.any(String),
      versionId: undefined,
      sequencer: expect.any(String),
    })
  })

  test('can override defaults', () => {
    const key = randomUUID()
    const size = 456
    const eTag = randomUUID()
    const versionId = randomUUID()
    const sequencer = randomUUID()
    expect(createRecordObject({
      key,
      size,
      eTag,
      versionId,
      sequencer,
    })).toStrictEqual({
      key,
      size,
      eTag,
      versionId,
      sequencer,
    })
  })
})

describe('createS3Record', () => {
  test('will set defaults', () => {
    const bucket = createRecordBucket({ name: randomUUID() })
    const object = createRecordObject({ key: randomUUID() })
    expect(createRecord({
      bucket,
      object,
    })).toStrictEqual({
      s3SchemaVersion: expect.any(String),
      configurationId: expect.any(String),
      bucket,
      object,
    })
  })

  test('can override defaults', () => {
    const bucket = createRecordBucket({ name: randomUUID() })
    const object = createRecordObject({ key: randomUUID() })
    const s3SchemaVersion = randomUUID()
    const configurationId = randomUUID()
    expect(createRecord({
      s3SchemaVersion,
      configurationId,
      bucket,
      object,
    })).toStrictEqual({
      s3SchemaVersion,
      configurationId,
      bucket,
      object,
    })
  })
})

describe('createLambdaEventRecord', () => {
  test('will set defaults', () => {
    const s3 = createRecord({
      bucket: createRecordBucket({ name: randomUUID() }),
      object: createRecordObject({ key: randomUUID() }),
    })
    expect(createLambdaEventRecord({
      s3,
    })).toStrictEqual({
      s3,
      eventVersion: expect.any(String),
      eventSource: 'aws:s3',
      awsRegion: 'us-east-1',
      eventTime: expect.any(String),
      eventName: 'ObjectCreated:Put',
      userIdentity: {
        principalId: expect.any(String),
      },
      requestParameters: {
        sourceIPAddress: expect.any(String),
      },
      responseElements: {
        'x-amz-request-id': expect.any(String),
        'x-amz-id-2': expect.any(String),
      },
      glacierEventData: undefined,
    })
  })

  test('can override defaults', () => {
    const s3 = createRecord({
      bucket: createRecordBucket({ name: randomUUID() }),
      object: createRecordObject({ key: randomUUID() }),
    })
    const eventVersion = randomUUID()
    const awsRegion = randomUUID()
    const eventTime = randomUUID()
    const eventName = 'TestEvent'
    const userIdentity = { principalId: randomUUID() }
    const requestParameters = { sourceIPAddress: randomUUID() }
    const responseElements = { 'x-amz-request-id': randomUUID(), 'x-amz-id-2': randomUUID() }
    const glacierEventData = {
      restoreEventData: {
        lifecycleRestorationExpiryTime: randomUUID(),
        lifecycleRestoreStorageClass: randomUUID(),
      },
    }

    expect(createLambdaEventRecord({
      s3,
      eventVersion,
      awsRegion,
      eventTime,
      eventName,
      userIdentity,
      requestParameters,
      responseElements,
      glacierEventData,
    })).toStrictEqual({
      s3,
      eventVersion,
      eventSource: 'aws:s3',
      awsRegion,
      eventTime,
      eventName,
      userIdentity,
      requestParameters,
      responseElements,
      glacierEventData,
    })
  })
})
