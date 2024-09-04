import { randomUUID } from 'crypto'
import { marshalItem, unmarshalItem } from '../../src/dynamodb/marshaller.ts'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

vi.mock('@aws-sdk/util-dynamodb')

describe('marshalItem', () => {
  test('will not throw an error with no inputs', () => {
    expect(() => marshalItem()).not.toThrow()
  })

  test('will call Converter.marshall', () => {
    const item = { item: randomUUID() }
    marshalItem(item)
    expect(marshall).toHaveBeenCalledWith(item, undefined)
  })

  test('will call Converter.marshall with options', () => {
    const item = { item: randomUUID() }
    const options = {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    }
    marshalItem(item, options)
    expect(marshall).toHaveBeenCalledWith(item, options)
  })
})

describe('unmarshalItem', () => {
  test('will not throw an error with no inputs', () => {
    expect(() => unmarshalItem()).not.toThrow()
  })

  test('will call Converter.unmarshall', () => {
    const item = { item: { S: randomUUID() } }
    unmarshalItem(item)
    expect(unmarshall).toHaveBeenCalledWith(item, undefined)
  })

  test('will call Converter.unmarshall with options', () => {
    const item = { item: { S: randomUUID() } }
    const options = {
      wrapNumbers: true,
    }
    unmarshalItem(item, options)
    expect(unmarshall).toHaveBeenCalledWith(item, options)
  })
})
