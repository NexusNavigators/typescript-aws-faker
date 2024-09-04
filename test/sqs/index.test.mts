import * as index from '../../src/sqs/index.ts'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    event: expect.any(Object),
  }))
})
