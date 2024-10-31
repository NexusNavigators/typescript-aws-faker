import type {
  APIGatewayEventIdentity,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayRequestAuthorizerEvent,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayEventClientCertificate,
} from 'aws-lambda'

import {
  buildARNString,
  createAccountId,
  createARN,
  type PartialArn,
} from '../account/index'

export const createClientCertificate = (
  {
    clientCertPem = '',
    serialNumber = '',
    subjectDN = '',
    issuerDN = '',
    validity = {
      notAfter: '',
      notBefore: '',
    },
  }: Partial<APIGatewayEventClientCertificate>,
): APIGatewayEventClientCertificate => ({
  clientCertPem,
  serialNumber,
  subjectDN,
  issuerDN,
  validity,
})

export type PartialEventIdentity = Partial<APIGatewayEventIdentity>
export type PartialRequestContextWithAuthorizer = Partial<Omit<APIGatewayEventRequestContextWithAuthorizer<undefined>, 'identity'>> & {
  identity?: PartialEventIdentity
}

export const createEventIdentity = (
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
    sourceIp = '',
    user = null,
    userAgent = null,
    userArn = null,
  }: PartialEventIdentity = {},
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

export const createRequestContextWithAuthorizer = (
  {
    accountId = createAccountId(),
    apiId = '',
    authorizer,
    connectedAt,
    connectionId,
    domainName,
    domainPrefix,
    eventType,
    extendedRequestId,
    protocol = '',
    httpMethod = '',
    identity,
    messageDirection,
    messageId,
    path = '',
    stage = '',
    requestId = '',
    requestTime,
    requestTimeEpoch = 0,
    resourceId = '',
    resourcePath = '',
    routeKey,
  }: PartialRequestContextWithAuthorizer = {},
): APIGatewayEventRequestContextWithAuthorizer<undefined> => ({
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
  identity: createEventIdentity(identity),
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

export type PartialRequestAuthorizerEvent = Partial<Omit<APIGatewayRequestAuthorizerEvent, 'type' | 'methodArn' | 'requestContext'>> & {
  methodArn?: PartialArn | string
  requestContext?: PartialRequestContextWithAuthorizer
}

export const createRequestAuthorizerEvent = (
  {
    methodArn = createARN(),
    resource = '',
    path = '',
    httpMethod = '',
    headers = null,
    multiValueHeaders = null,
    pathParameters = null,
    queryStringParameters = null,
    multiValueQueryStringParameters = null,
    stageVariables = null,
    requestContext,
  }: PartialRequestAuthorizerEvent,
): APIGatewayRequestAuthorizerEvent => ({
  methodArn: typeof methodArn === 'string' ? methodArn : buildARNString(methodArn),
  resource,
  path,
  httpMethod,
  headers,
  multiValueHeaders,
  pathParameters,
  queryStringParameters,
  multiValueQueryStringParameters,
  stageVariables,
  requestContext: createRequestContextWithAuthorizer(requestContext),
  type: 'REQUEST',
})

export type PartialTokenAuthorizerEvent = Partial<Omit<APIGatewayTokenAuthorizerEvent, 'type' | 'methodArn'>> & {
  methodArn?: PartialArn | string
}

export const createTokenAuthorizerEvent = (
  {
    methodArn = createARN(),
    authorizationToken = '',
  }: PartialTokenAuthorizerEvent = {},
): APIGatewayTokenAuthorizerEvent => ({
  methodArn: typeof methodArn === 'string' ? methodArn : buildARNString(methodArn),
  authorizationToken,
  type: 'TOKEN',
})
