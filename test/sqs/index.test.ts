import * as index from '../../src/sqs'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    event: expect.any(Object),
  }))
})