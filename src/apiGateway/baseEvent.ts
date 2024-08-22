import { randomUUID } from 'crypto'
import { APIGatewayEventIdentity } from 'aws-lambda'
import { APIGatewayEventRequestContextWithAuthorizer } from 'aws-lambda/common/api-gateway'
import { createAccountId } from '../account'

export const createAPIGatewayEventIdentity = (
  {
    accessKey = null,
    accountId = null,
    apiKey = null,
    apiKeyId = null,
    caller = null,
    clientCert = null,
    cognitoAuthenticationProvider = null,
    cognitoAuthenticationType = null,
    cognitoIdentityId = null,
    cognitoIdentityPoolId = null,
    principalOrgId = null,
    sourceIp = '127.0.0.1',
    user = null,
    userAgent = null,
    userArn = null,
  }: Partial<APIGatewayEventIdentity> = {},
): APIGatewayEventIdentity => ({
  accessKey,
  accountId,
  apiKey,
  apiKeyId,
  caller,
  clientCert,
  cognitoAuthenticationProvider,
  cognitoAuthenticationType,
  cognitoIdentityId,
  cognitoIdentityPoolId,
  principalOrgId,
  sourceIp,
  user,
  userAgent,
  userArn,
})

export type PartialAuthorizer<TAuthorizerContext> =
  Partial<Omit<APIGatewayEventRequestContextWithAuthorizer<TAuthorizerContext>, 'authorizer' | 'identity'>>
  & {
    authorizer: TAuthorizerContext
    identity?: Partial<APIGatewayEventIdentity>
  }

export const createAPIGatewayEventRequestContextWithAuthorizer = <TAuthorizerContext>(
  {
    accountId = createAccountId(),
    apiId = '1.0',
    authorizer,
    connectedAt,
    connectionId,
    domainName,
    domainPrefix,
    eventType,
    extendedRequestId,
    protocol = 'http',
    httpMethod = 'GET',
    identity,
    messageDirection,
    messageId,
    path = '',
    stage = '$default',
    requestId = randomUUID(),
    requestTime,
    requestTimeEpoch = Date.now(),
    resourceId = '',
    resourcePath = '',
    routeKey,
  }: PartialAuthorizer<TAuthorizerContext>,
): APIGatewayEventRequestContextWithAuthorizer<TAuthorizerContext> => ({
  accountId,
  apiId,
  authorizer,
  connectedAt,
  connectionId,
  domainName,
  domainPrefix,
  eventType,
  extendedRequestId,
  protocol,
  httpMethod,
  identity: createAPIGatewayEventIdentity(identity),
  messageDirection,
  messageId,
  path,
  stage,
  requestId,
  requestTime,
  requestTimeEpoch,
  resourceId,
  resourcePath,
  routeKey,
})
