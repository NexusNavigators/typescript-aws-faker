import * as index from '../../src/lambda/index.ts'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    context: expect.any(Object),
  }))
})
