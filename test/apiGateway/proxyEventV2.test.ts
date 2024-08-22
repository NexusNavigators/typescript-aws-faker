import { randomUUID } from 'crypto'
import { describe, test, expect } from 'vitest'
import {
  createApiGatewayProxyEventV2,
  createAPIGatewayProxyEventV2RequestContextHttp,
  createAPIGatewayProxyEventV2RequestContext,
  APIGatewayProxyEventV2RequestContext,
  APIGatewayProxyEventV2RequestContextHttp,
} from '../../src/apiGateway/proxyEventV2'
import { APIGatewayProxyEventV2 } from 'aws-lambda'

const expectDefaultHttp: APIGatewayProxyEventV2RequestContextHttp = {
  method: 'GET',
  path: '/',
  protocol: 'http',
  sourceIp: '127.0.0.1',
  userAgent: 'aws-sdk-helpers',
}

const expectDefaultRequestContext: APIGatewayProxyEventV2RequestContext = {
  accountId: expect.any(String),
  apiId: 'v2.0',
  authentication: undefined,
  domainName: 'id.execute-api.us-east-1.amazonaws.com',
  domainPrefix: 'id',
  http: expectDefaultHttp,
  requestId: 'id',
  routeKey: '$default',
  stage: '$default',
  time: expect.any(String),
  timeEpoch: expect.any(Number),
}

describe('createAPIGatewayProxyEventV2RequestContextHttp', () => {
  test('will set defaults', () => {
    expect(createAPIGatewayProxyEventV2RequestContextHttp()).toStrictEqual(expectDefaultHttp)
  })
  test('can override defaults', () => {
    const expected: APIGatewayProxyEventV2RequestContextHttp = {
      method: randomUUID(),
      path: randomUUID(),
      protocol: randomUUID(),
      sourceIp: randomUUID(),
      userAgent: randomUUID(),
    }
    expect(createAPIGatewayProxyEventV2RequestContextHttp(expected)).toStrictEqual(expected)
  })
})

describe('createAPIGatewayProxyEventV2RequestContext', () => {
  test('will set defaults', () => {
    expect(createAPIGatewayProxyEventV2RequestContext()).toStrictEqual(expectDefaultRequestContext)
  })

  test('can override defaults', () => {
    const expected: Omit<APIGatewayProxyEventV2RequestContext, 'time'> = {
      accountId: randomUUID(),
      apiId: randomUUID(),
      domainName: randomUUID(),
      domainPrefix: randomUUID(),
      http: expectDefaultHttp,
      requestId: randomUUID(),
      routeKey: randomUUID(),
      stage: randomUUID(),
      timeEpoch: Date.now(),
    }
    expect(createAPIGatewayProxyEventV2RequestContext(expected)).toStrictEqual({
      time: new Date(expected.timeEpoch).toISOString(),
      authentication: undefined,
      ...expected,
    })
  })
})

describe('createApiGatewayProxyEventV2', () => {
  test('will set defaults', () => {
    expect(createApiGatewayProxyEventV2()).toStrictEqual({
      body: undefined,
      cookies: undefined,
      headers: {},
      isBase64Encoded: false,
      pathParameters: undefined,
      queryStringParameters: undefined,
      rawPath: '/',
      rawQueryString: '',
      requestContext: {
        ...expectDefaultRequestContext,
      },
      routeKey: '$default',
      stageVariables: undefined,
      version: '2.0',
    })
  })

  test('can override defaults', () => {
    const expected: Omit<APIGatewayProxyEventV2, 'version'> = {
      requestContext: {
        ...expectDefaultRequestContext,
        timeEpoch: Date.now() - 20e3,
      },
      routeKey: randomUUID(),
      rawPath: randomUUID(),
      rawQueryString: randomUUID(),
      cookies: [randomUUID()],
      headers: { [randomUUID()]: randomUUID() },
      queryStringParameters: { [randomUUID()]: randomUUID() },
      body: randomUUID(),
      pathParameters: { [randomUUID()]: randomUUID() },
      isBase64Encoded: true,
      stageVariables: { [randomUUID()]: randomUUID() },
    }
    expect(createApiGatewayProxyEventV2(expected)).toStrictEqual({
      version: '2.0',
      ...expected,
    })
  })
})
