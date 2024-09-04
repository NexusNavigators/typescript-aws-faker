import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import type { marshallOptions, unmarshallOptions } from '@aws-sdk/util-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

export type AttributeMap = Record<string, AttributeValue>

export const marshalItem = <
  ReturnType extends AttributeMap = AttributeMap,
> (
  item?: Record<string, any>,
  options?: marshallOptions,
): ReturnType | undefined => {
  if (item) {
    return marshall(item, options) as ReturnType
  }
}

export const unmarshalItem = <T extends Record<string, any>> (
  item?: AttributeMap,
  options?: unmarshallOptions,
): T | undefined => {
  if (item) {
    return unmarshall(item, options) as T
  }
}
