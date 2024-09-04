import { randomUUID } from 'crypto'
import type { APIGatewayProxyEvent } from 'aws-lambda'
import { createAPIGatewayProxyEvent } from '../../src/apiGateway/proxyEvent.ts'

describe('createAPIGatewayProxyEventV2RequestContext', () => {
  test('will set defaults', () => {
    expect(createAPIGatewayProxyEvent()).toStrictEqual({
      body: null,
      headers: {},
      httpMethod: '',
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
      path: '',
      pathParameters: null,
      queryStringParameters: null,
      requestContext: {
        accountId: expect.any(String),
        apiId: '1.0',
        authorizer: null,
        connectedAt: undefined,
        connectionId: undefined,
        domainName: undefined,
        domainPrefix: undefined,
        eventType: undefined,
        extendedRequestId: undefined,
        httpMethod: 'GET',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '127.0.0.1',
          user: null,
          userAgent: null,
          userArn: null,
        },
        messageDirection: undefined,
        messageId: undefined,
        path: '',
        protocol: 'http',
        requestId: expect.any(String),
        requestTime: undefined,
        requestTimeEpoch: expect.any(Number),
        resourceId: '',
        resourcePath: '',
        routeKey: undefined,
        stage: '$default',
      },
      resource: '',
      stageVariables: null,
    })
  })
  test('can override defaults', () => {
    const expected: APIGatewayProxyEvent = {
      body: null,
      headers: { [randomUUID()]: randomUUID() },
      httpMethod: randomUUID(),
      isBase64Encoded: true,
      multiValueHeaders: { [randomUUID()]: [randomUUID()] },
      multiValueQueryStringParameters: { [randomUUID()]: [randomUUID()] },
      path: randomUUID(),
      pathParameters: { [randomUUID()]: randomUUID() },
      queryStringParameters: { [randomUUID()]: randomUUID() },
      requestContext: {
        accountId: randomUUID(),
        apiId: randomUUID(),
        authorizer: { [randomUUID()]: randomUUID() },
        connectedAt: 123456,
        connectionId: randomUUID(),
        domainName: randomUUID(),
        domainPrefix: randomUUID(),
        eventType: randomUUID(),
        extendedRequestId: randomUUID(),
        httpMethod: randomUUID(),
        identity: {
          accessKey: randomUUID(),
          accountId: randomUUID(),
          apiKey: randomUUID(),
          apiKeyId: randomUUID(),
          caller: randomUUID(),
          clientCert: {
            clientCertPem: randomUUID(),
            serialNumber: randomUUID(),
            subjectDN: randomUUID(),
            issuerDN: randomUUID(),
            validity: {
              notAfter: randomUUID(),
              notBefore: randomUUID(),
            },
          },
          cognitoAuthenticationProvider: randomUUID(),
          cognitoAuthenticationType: randomUUID(),
          cognitoIdentityId: randomUUID(),
          cognitoIdentityPoolId: randomUUID(),
          principalOrgId: randomUUID(),
          sourceIp: randomUUID(),
          user: randomUUID(),
          userAgent: randomUUID(),
          userArn: randomUUID(),
        },
        messageDirection: randomUUID(),
        messageId: randomUUID(),
        path: randomUUID(),
        protocol: randomUUID(),
        requestId: randomUUID(),
        requestTime: randomUUID(),
        requestTimeEpoch: 123456,
        resourceId: randomUUID(),
        resourcePath: randomUUID(),
        routeKey: randomUUID(),
        stage: randomUUID(),
      },
      resource: randomUUID(),
      stageVariables: { },
    }
    expect(createAPIGatewayProxyEvent(expected)).toStrictEqual(expected)
  })
})