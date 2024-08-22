import * as index from '../../src/s3'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    objectEvent: expect.any(Object),
  }))
})
