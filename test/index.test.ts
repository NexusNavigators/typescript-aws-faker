import { test, expect } from 'vitest'
import * as index from '../src'

test('validate we have things', () => {
  expect(index.account).not.toBeUndefined()
  expect(index.apiGateway).not.toBeUndefined()
  expect(index.cloudWatch).not.toBeUndefined()
  expect(index.dynamodb).not.toBeUndefined()
  expect(index.kinesis).not.toBeUndefined()
  expect(index.lambda).not.toBeUndefined()
  expect(index.s3).not.toBeUndefined()
  expect(index.sqs).not.toBeUndefined()
})
