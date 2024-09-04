import * as index from '../../src/s3/index.ts'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    objectEvent: expect.any(Object),
  }))
})
