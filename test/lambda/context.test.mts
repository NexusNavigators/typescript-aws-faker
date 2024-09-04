import { randomUUID } from 'crypto'

import {
  createClientContextClient,
  createClientContextEnv,
  createClientContext,
  createContext,
} from '../../src/lambda/context.ts'
import type { ClientContextClient, ClientContextEnv, Context } from 'aws-lambda'
import type { ARN } from '@aws-sdk/util-arn-parser'
import { createAccountId, buildARNString } from '../../src/account/index.ts'

const defaultClientContextClient: ClientContextClient = {
  installationId: '',
  appTitle: '',
  appVersionName: '',
  appVersionCode: '',
  appPackageName: '',
}

const customClientContextClient: ClientContextClient = {
  installationId: randomUUID(),
  appTitle: randomUUID(),
  appVersionName: randomUUID(),
  appVersionCode: randomUUID(),
  appPackageName: randomUUID(),
}

const defaultClientContextEnv: ClientContextEnv = {
  platformVersion: '',
  platform: '',
  make: '',
  model: '',
  locale: '',
}

const customClientContextEnv: ClientContextEnv = {
  platformVersion: randomUUID(),
  platform: randomUUID(),
  make: randomUUID(),
  model: randomUUID(),
  locale: randomUUID(),
}

describe('createClientContextClient', () => {
  test('will set defaults', () => {
    expect(createClientContextClient()).toStrictEqual(defaultClientContextClient)
  })

  test('can override defaults', () => {
    expect(createClientContextClient(customClientContextClient)).toStrictEqual(customClientContextClient)
  })
})

describe('createClientContextEnv', () => {
  test('will set defaults', () => {
    expect(createClientContextEnv()).toStrictEqual(defaultClientContextEnv)
  })

  test('can override defaults', () => {
    expect(createClientContextEnv(customClientContextEnv)).toStrictEqual(customClientContextEnv)
  })
})

describe('createClientContext', () => {
  test('will set defaults', () => {
    expect(createClientContext()).toStrictEqual({
      client: defaultClientContextClient,
      Custom: undefined,
      env: defaultClientContextEnv,
    })
  })

  test('can override defaults', () => {
    const expected = {
      client: customClientContextClient,
      Custom: { [randomUUID()]: randomUUID() },
      env: customClientContextEnv,
    }
    expect(createClientContext(expected)).toStrictEqual(expected)
  })
})

describe('createContext', () => {
  test('will set defaults', () => {
    const actual = createContext()
    expect(actual).toStrictEqual({
      awsRequestId: expect.any(String),
      callbackWaitsForEmptyEventLoop: false,
      clientContext: undefined,
      done: expect.any(Function),
      fail: expect.any(Function),
      functionName: 'missing',
      functionVersion: '1',
      getRemainingTimeInMillis: expect.any(Function),
      identity: undefined,
      invokedFunctionArn: expect.any(String),
      logGroupName: '',
      logStreamName: '',
      memoryLimitInMB: '256',
      succeed: expect.any(Function),
    })
    expect(actual.getRemainingTimeInMillis()).toBe(0)
    expect(() => actual.done()).not.toThrow()
    expect(() => actual.fail(randomUUID())).not.toThrow()
    expect(() => actual.succeed({})).not.toThrow()
    expect(() => actual.succeed(randomUUID(), {})).not.toThrow()
  })

  test('can override defaults', () => {
    type RequiredContext =
      Omit<Context, 'invokedFunctionArn'>
      & { invokedFunctionArn: Omit<ARN, 'service'> }
    const expected: RequiredContext = {
      callbackWaitsForEmptyEventLoop: true,
      functionName: randomUUID(),
      functionVersion: randomUUID(),
      invokedFunctionArn: { accountId: createAccountId(), region: 'us-west-1', resource: 'function', partition: 'aws' },
      memoryLimitInMB: '512',
      awsRequestId: randomUUID(),
      logGroupName: randomUUID(),
      logStreamName: randomUUID(),
      identity: {
        cognitoIdentityId: randomUUID(),
        cognitoIdentityPoolId: randomUUID(),
      },
      clientContext: {
        client: customClientContextClient,
        Custom: randomUUID(),
        env: customClientContextEnv,
      },
      getRemainingTimeInMillis(): number {
        return 11
      },
      done() {
        return false
      },
      fail() {
        return false
      },
      succeed() {
        return false
      },
    }
    expect(createContext(expected)).toStrictEqual({
      ...expected,
      invokedFunctionArn: buildARNString({ service: 'lambda', ...expected.invokedFunctionArn }),
    })
  })
})
