import * as index from '../../src/kinesis'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    stream: expect.any(Object),
  }))
})
