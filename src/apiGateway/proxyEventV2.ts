import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { createAccountId } from '../account/index'

export type APIGatewayProxyEventV2RequestContext = APIGatewayProxyEventV2['requestContext']
export type APIGatewayProxyEventV2RequestContextHttp = APIGatewayProxyEventV2RequestContext['http']

export const createAPIGatewayProxyEventV2RequestContextHttp = (
  {
    method = 'GET',
    path = '/',
    protocol = 'http',
    sourceIp = '127.0.0.1',
    userAgent = 'aws-sdk-helpers',
  }: Partial<APIGatewayProxyEventV2RequestContextHttp> = {},
): APIGatewayProxyEventV2RequestContextHttp => ({
  method,
  path,
  protocol,
  sourceIp,
  userAgent,
})

type PartialRequestContext =
  Partial<Omit<APIGatewayProxyEventV2RequestContext, 'http' | 'time'>>
  & { http?: Partial<APIGatewayProxyEventV2RequestContextHttp> }

export const createAPIGatewayProxyEventV2RequestContext = (
  {
    accountId = createAccountId(),
    apiId = 'v2.0',
    authentication,
    domainName = 'id.execute-api.us-east-1.amazonaws.com',
    domainPrefix = 'id',
    http,
    requestId = 'id',
    routeKey = '$default',
    stage = '$default',
    timeEpoch = Date.now(),
  }: PartialRequestContext = {},
): APIGatewayProxyEventV2RequestContext => ({
  accountId,
  apiId,
  authentication,
  domainName,
  domainPrefix,
  http: createAPIGatewayProxyEventV2RequestContextHttp(http),
  requestId,
  routeKey,
  stage,
  time: new Date(timeEpoch).toISOString(),
  timeEpoch,
})

export type PartialProxyEventV2 =
  Partial<Omit<APIGatewayProxyEventV2, 'requestContext' | 'version'>>
  & { requestContext?: PartialRequestContext }

export const createApiGatewayProxyEventV2 = (
  {
    routeKey = '$default',
    rawPath = '/',
    rawQueryString = '',
    cookies,
    headers = {},
    queryStringParameters,
    requestContext,
    body,
    pathParameters,
    isBase64Encoded = false,
    stageVariables,
  }: PartialProxyEventV2 = {},
): APIGatewayProxyEventV2 => ({
  version: '2.0',
  routeKey,
  rawPath,
  rawQueryString,
  cookies,
  headers,
  queryStringParameters,
  requestContext: createAPIGatewayProxyEventV2RequestContext(requestContext),
  body,
  pathParameters,
  isBase64Encoded,
  stageVariables,
})
