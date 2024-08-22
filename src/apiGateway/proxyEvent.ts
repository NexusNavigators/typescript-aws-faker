import { APIGatewayProxyEvent } from 'aws-lambda'
import {
  APIGatewayEventDefaultAuthorizerContext,
} from 'aws-lambda/common/api-gateway'
import { createAPIGatewayEventRequestContextWithAuthorizer, PartialAuthorizer } from './baseEvent'

export type PartialProxyEvent =
  Partial<Omit<APIGatewayProxyEvent, 'requestContext'>>
  & { requestContext?: PartialAuthorizer<APIGatewayEventDefaultAuthorizerContext> }

export const createAPIGatewayProxyEvent = (
  {
    body = null,
    headers = {},
    multiValueHeaders = {},
    httpMethod = '',
    isBase64Encoded = false,
    path = '',
    pathParameters = null,
    queryStringParameters = null,
    multiValueQueryStringParameters = null,
    stageVariables = null,
    requestContext = { authorizer: null },
    resource = '',
  }: PartialProxyEvent = {},
): APIGatewayProxyEvent => ({
  body,
  headers,
  multiValueHeaders,
  httpMethod,
  isBase64Encoded,
  path,
  pathParameters,
  queryStringParameters,
  multiValueQueryStringParameters,
  stageVariables,
  requestContext: createAPIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>(requestContext),
  resource,
})
