import { randomInt } from 'crypto'
import type { ARN } from '@aws-sdk/util-arn-parser'
import { build, parse } from '@aws-sdk/util-arn-parser'

export const createAccountId = () => `${randomInt(1e11, 1e12)}`

export type PartialArn = Partial<ARN>

export type PartialServiceArn = Omit<PartialArn, 'service'>

export const createARN = (
  {
    partition = 'aws',
    service = '',
    region = '',
    accountId = '',
    resource = '',
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

export const parseArnString = (arnString: string) => parse(arnString)
