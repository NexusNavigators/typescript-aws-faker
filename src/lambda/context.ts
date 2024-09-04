import type {
  ClientContext,
  ClientContextClient,
  ClientContextEnv,
  Context,
} from 'aws-lambda'
import { randomUUID } from 'crypto'
import type { PartialServiceArn } from '../account/index'
import { buildARNString } from '../account/index'

export const createClientContextClient = (
  {
    installationId = '',
    appTitle = '',
    appVersionName = '',
    appVersionCode = '',
    appPackageName = '',
  }: Partial<ClientContextClient> = {},
): ClientContextClient => ({
  installationId,
  appTitle,
  appVersionName,
  appVersionCode,
  appPackageName,
})

export const createClientContextEnv = (
  {
    platformVersion = '',
    platform = '',
    make = '',
    model = '',
    locale = '',
  }: Partial<ClientContextEnv> = {},
): ClientContextEnv => ({
  platformVersion,
  platform,
  make,
  model,
  locale,
})

export type PartialClientContext =
  Partial<Omit<ClientContext, 'client' | 'env'>>
  & {
    client?: Partial<ClientContextClient>
    env?: Partial<ClientContextEnv>
  }

export const createClientContext = (
  {
    client,
    Custom,
    env,
  }: PartialClientContext = {},
) => ({
  client: createClientContextClient(client),
  Custom,
  env: createClientContextEnv(env),
})

export type PartialContext =
  Partial<Omit<Context, 'invokedFunctionArn'>>
  & { invokedFunctionArn?: PartialServiceArn }

export const createContext = (
  {
    callbackWaitsForEmptyEventLoop = false,
    functionName = 'missing',
    functionVersion = '1',
    invokedFunctionArn,
    memoryLimitInMB = '256',
    awsRequestId = randomUUID(),
    logGroupName = '',
    logStreamName = '',
    identity,
    clientContext,
    getRemainingTimeInMillis = () => 0,
    done = () => undefined,
    fail = () => undefined,
    succeed = () => undefined,
  }: PartialContext = {},
): Context => ({
  callbackWaitsForEmptyEventLoop,
  functionName,
  functionVersion,
  invokedFunctionArn: buildARNString({ ...invokedFunctionArn, service: 'lambda' }),
  memoryLimitInMB,
  awsRequestId,
  logGroupName,
  logStreamName,
  identity,
  clientContext: clientContext ? createClientContext(clientContext) : clientContext,
  getRemainingTimeInMillis,
  done,
  fail,
  succeed,
})
