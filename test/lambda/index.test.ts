import * as index from '../../src/lambda'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    context: expect.any(Object),
  }))
})
