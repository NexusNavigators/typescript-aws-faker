import * as index from '../../src/sns'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    event: expect.any(Object),
  }))
})
