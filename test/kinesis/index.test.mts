import * as index from '../../src/kinesis/index.ts'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    stream: expect.any(Object),
  }))
})
