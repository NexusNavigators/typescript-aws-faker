import * as index from '../../src/cloudWatch'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    logs: expect.any(Object),
  }))
})
