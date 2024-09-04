import * as index from '../../src/cloudWatch/index.ts'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    logs: expect.any(Object),
  }))
})
