import type {
  PartialRequestAuthorizerEvent,
} from '../../src/apiGateway/authorizer.ts'
import {
  createClientCertificate,
  createRequestAuthorizerEvent,
  createTokenAuthorizerEvent,
} from '../../src/apiGateway/authorizer.ts'
import {
  type PartialArn,
  buildARNString,
} from '../../src/account/index.ts'

describe('createRequestAuthorizerEvent', () => {
  test('should create event with minimal params', () => {
    const event = createRequestAuthorizerEvent({})
    expect(event.type).toBe('REQUEST')
    expect(event.methodArn).toBeDefined()
    expect(event.resource).toBe('')
    expect(event.path).toBe('')
    expect(event.httpMethod).toBe('')
  })

  test('should handle string methodArn', () => {
    const methodArn = 'arn:aws:execute-api:region:account:api/stage/method/path'
    const event = createRequestAuthorizerEvent({ methodArn })
    expect(event.methodArn).toBe(methodArn)
  })

  test('should handle object methodArn', () => {
    const methodArnObj: PartialArn = {
      region: 'us-east-1',
      accountId: '123456789',
    }
    const event = createRequestAuthorizerEvent({
      methodArn: methodArnObj,
    })
    expect(event.methodArn).toBe(buildARNString(methodArnObj))
  })

  test('should include all optional parameters', () => {
    const params: PartialRequestAuthorizerEvent = {
      resource: '/test',
      path: '/test/path',
      httpMethod: 'GET',
      headers: { 'Content-Type': 'application/json' },
      multiValueHeaders: { Accept: ['text/html', 'application/json'] },
      pathParameters: { id: '123' },
      queryStringParameters: { filter: 'active' },
      multiValueQueryStringParameters: { tags: ['a', 'b'] },
      stageVariables: { env: 'test' },
      requestContext: {
        accountId: '123456789',
        apiId: 'api123',
        authorizer: undefined,
        protocol: 'HTTP/1.1',
        httpMethod: 'GET',
        identity: { sourceIp: '127.0.0.1' },
        requestId: 'req123',
        resourceId: 'resId',
        resourcePath: '/test',
        stage: 'dev',
      },
    }

    const event = createRequestAuthorizerEvent(params)
    expect(event).toStrictEqual({
      ...params,
      type: 'REQUEST',
      methodArn: expect.any(String),
      requestContext: expect.objectContaining({
        ...params.requestContext,
        identity: expect.objectContaining({
          ...params.requestContext?.identity,

        }),
      }),
    })
  })

  test('should handle null values for optional parameters', () => {
    const event = createRequestAuthorizerEvent({
      headers: null,
      multiValueHeaders: null,
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    })

    expect(event.headers).toBeNull()
    expect(event.multiValueHeaders).toBeNull()
    expect(event.pathParameters).toBeNull()
    expect(event.queryStringParameters).toBeNull()
    expect(event.multiValueQueryStringParameters).toBeNull()
    expect(event.stageVariables).toBeNull()
  })
})

describe('createClientCertificate', () => {
  test('should create certificate with all provided values', () => {
    const certificate = createClientCertificate({
      clientCertPem: 'cert-pem',
      serialNumber: '123456',
      subjectDN: 'subject-dn',
      issuerDN: 'issuer-dn',
      validity: {
        notAfter: '2024-12-31',
        notBefore: '2024-01-01',
      },
    })

    expect(certificate).toEqual({
      clientCertPem: 'cert-pem',
      serialNumber: '123456',
      subjectDN: 'subject-dn',
      issuerDN: 'issuer-dn',
      validity: {
        notAfter: '2024-12-31',
        notBefore: '2024-01-01',
      },
    })
  })

  test('should create certificate with default empty values when no params provided', () => {
    const certificate = createClientCertificate({})

    expect(certificate).toEqual({
      clientCertPem: '',
      serialNumber: '',
      subjectDN: '',
      issuerDN: '',
      validity: {
        notAfter: '',
        notBefore: '',
      },
    })
  })

  test('should create certificate with partial values', () => {
    const certificate = createClientCertificate({
      clientCertPem: 'cert-pem',
      serialNumber: '123456',
    })

    expect(certificate).toEqual({
      clientCertPem: 'cert-pem',
      serialNumber: '123456',
      subjectDN: '',
      issuerDN: '',
      validity: {
        notAfter: '',
        notBefore: '',
      },
    })
  })

  test('should create certificate with custom validity', () => {
    const certificate = createClientCertificate({
      validity: {
        notAfter: '2025-12-31',
        notBefore: '2025-01-01',
      },
    })

    expect(certificate).toEqual({
      clientCertPem: '',
      serialNumber: '',
      subjectDN: '',
      issuerDN: '',
      validity: {
        notAfter: '2025-12-31',
        notBefore: '2025-01-01',
      },
    })
  })
})

describe('createTokenAuthorizerEvent', () => {
  it('should create event with default values when no params provided', () => {
    const event = createTokenAuthorizerEvent()

    expect(event.type).toBe('TOKEN')
    expect(event.authorizationToken).toBe('')
    expect(typeof event.methodArn).toBe('string')
  })

  it('should create event with provided authorization token', () => {
    const event = createTokenAuthorizerEvent({
      authorizationToken: 'Bearer xyz123',
    })

    expect(event.authorizationToken).toBe('Bearer xyz123')
    expect(event.type).toBe('TOKEN')
  })

  it('should create event with string methodArn', () => {
    const methodArn = 'arn:aws:execute-api:region:account:api/stage/method/path'
    const event = createTokenAuthorizerEvent({ methodArn })

    expect(event.methodArn).toBe(methodArn)
    expect(event.type).toBe('TOKEN')
  })

  it('should create event with object methodArn by building ARN string', () => {
    const methodArn = {
      region: 'us-east-1',
      accountId: '123456789012',
      apiId: 'api123',
      stage: 'prod',
      method: 'GET',
      resource: '/users',
    }

    const event = createTokenAuthorizerEvent({ methodArn })

    expect(event.methodArn).toBe(buildARNString(methodArn))
    expect(event.type).toBe('TOKEN')
  })

  it('should create event with both custom methodArn and authorizationToken', () => {
    const methodArn = 'arn:aws:execute-api:us-west-2:987654321098:api456/test/POST/orders'
    const authorizationToken = 'Bearer abc987'

    const event = createTokenAuthorizerEvent({ methodArn, authorizationToken })

    expect(event.methodArn).toBe(methodArn)
    expect(event.authorizationToken).toBe(authorizationToken)
    expect(event.type).toBe('TOKEN')
  })
})
