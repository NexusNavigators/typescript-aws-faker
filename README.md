# aws-data-faker

# AWS Data Stubs for Unit Testing

[![npm version](https://badgen.net/npm/v/@nexus-navigators/aws-data-faker)](https://www.npmjs.com/package/@nexus-navigators/aws-data-faker)
[![npm downloads](https://badgen.net/npm/dm/@nexus-navigators/aws-data-faker)](https://www.npmjs.com/package/@nexus-navigators/aws-data-faker)
[![Continuous Integration](https://github.com/NexusNavigators/aws-data-faker/actions/workflows/ci.yaml/badge.svg)](https://github.com/NexusNavigators/aws-data-faker/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/github/NexusNavigators/aws-data-faker/graph/badge.svg?token=3H6CVWAYSY)](https://codecov.io/github/NexusNavigators/aws-data-faker)

## Overview

This project provides a set of functions to stub AWS responses, making it easier to write unit tests for applications that interact with AWS services.
By using these stubs, you can fake AWS response objects without needing to fill in every field.
Fields are filled in based on Typescript requirements, where some values are defaulted to what the real value would be.

Types are matched, for the most part, from `@types/aws-lambda`.

## Features

- **Service type stubs**: Includes stubs for popular AWS services like S3, DynamoDB, Lambda, and more.
- **TypeScript Support**: Fully typed to ensure type safety and better developer experience.
- **Lightweight**: No external dependencies other than `@aws-sdk/util-arn-parser` and `@types/aws-lambda`.

## Installation

You can install this package via npm:

```bash
npm install --save-dev @nexus-navigators/aws-data-faker
```

Or with yarn:

```bash
yarn add --dev @nexus-navigators/aws-data-faker
```

## Usage

Here is an example of how to use the mocks in a unit test:

```typescript
import { proxyEvent } from '@nexus-navigators/aws-data-faker/apiGateway';

const event = proxyEvent.createAPIGatewayProxyEvent({ body: 'Some event body' });

console.log(event)

{
  body: 'Some event body',
  headers: {},
  multiValueHeaders: {},
  httpMethod: '',
  isBase64Encoded: false,
  path: '',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: '359400424592',
    apiId: '1.0',
    authorizer: null,
    connectedAt: undefined,
    connectionId: undefined,
    domainName: undefined,
    domainPrefix: undefined,
    eventType: undefined,
    extendedRequestId: undefined,
    protocol: 'http',
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
      userArn: null
    },
    messageDirection: undefined,
    messageId: undefined,
    path: '',
    stage: '$default',
    requestId: 'c22c67e6-b8e3-475c-bc1d-7935ef3deb0d',
    requestTime: undefined,
    requestTimeEpoch: 1724353818806,
    resourceId: '',
    resourcePath: '',
    routeKey: undefined
  },
  resource: ''
}

```


## Supported AWS Types

More services will be added over time. Contributions are welcome!


The following AWS Types are currently supported:

### Account

* ARN
* build ARN String from an ARN object

### API Gateway

* APIGatewayProxyEvent
* ApiGatewayProxyEventV2
* APIGatewayProxyEventV2RequestContext
* APIGatewayProxyEventV2RequestContextHttp

### CloudWatch
Provides some additional zip/unzip utility functions

* CloudWatchLogsLogEvent
* CloudWatchLogsDecodedData

### DynamoDB

Provides a marshall/unmarshall utility method using types

* DynamoDBRecord
* StreamRecord

### Kinesis

* KinesisStreamEvent
* KinesisStreamRecord
* KinesisStreamRecordPayload

### Lambda

* ClientContext
* ClientContextClient
* ClientContextEnv
* Context

### S3

* S3EventRecord
* RecordBucket
* RecordObject
* Record

### SNS

* SNSEventRecord
* SNSMessage

### SQS

* SQSRecordAttributes
* SQSMessageAttributes
* SQSRecord


## Contributing

We welcome contributions! Please see our [contributing guide](CONTRIBUTING.md) for details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
