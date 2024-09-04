import * as index from '../../src/dynamodb/index.ts'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    stream: expect.any(Object),
    marshaller: expect.any(Object),
  }))
})
