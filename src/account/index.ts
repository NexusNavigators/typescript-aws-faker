import { randomInt } from 'crypto'
import { ARN, build } from '@aws-sdk/util-arn-parser'

export const createAccountId = () => `${randomInt(1e11, 1e12)}`

export type PartialArn = Partial<ARN>

export const createARN = (
  {
    partition = 'aws',
    service = 'unknown',
    region = 'us-east-1',
    accountId = createAccountId(),
    resource = 'unknown',
  }: PartialArn = {},
): ARN => ({
  partition,
  service,
  region,
  accountId,
  resource,
})

export const buildARNString = (
  partialArn?: PartialArn,
): string => build(createARN(partialArn))
