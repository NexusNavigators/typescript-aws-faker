# aws-sdk-helpers

# DynamoDB

## Converter
Methods are provided to handle un/marshal calls to DynamoDB.Converter.marshal/unmarshal.  
These convenience methods are meant to handle instances where the item isn't provided, 
thus avoiding extra tests to get code coverage.

```typescript
import { dynamodb } from 'aws-sdk-helpers';
const { marshalItem, unmarshalItem } = dynamodb;
```

## Lambda Stream Event
These methods provide easy mocking of DyanmoDB Stream records.


### createStreamRecord
Provides some defaults, and properly structures the Records[].dynamodb object.

### createCustomStreamRecord
Provides some defaults and properly structures the Records[] entry.

### createCustomStreamRecord
A convenience method that converts Keys, OldImage, and NewImage and returns a DynamoDB Stream Record.

```typescript
import { dynamodb } from 'aws-sdk-helpers';
const { stream: { createCustomStreamRecord, createDynamoDBRecord } } = dynamodb;

const dynamodbRecords = originalData.map(([Keys, OldImage, NewImage]) => createCustomStreamRecord({
  Keys,
  OldImage,
  NewImage,
}));

const Records = dynamodbRecords.map(dynamodb => createDynamoDBRecord({dynamodb}));
const event = { Records };
await lambda.invoke(event, context);
```

## Releasing

This project uses semantic release. To trigger a release, merge a PR to master that includes commits prefixed with the relevant strings. For more info, see [the spec](https://www.conventionalcommits.org/en/v1.0.0/#specification).
