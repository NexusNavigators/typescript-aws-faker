import * as index from '../../src/apiGateway/index.ts'

test('exports objects', () => {
  expect(index).toStrictEqual(expect.objectContaining({
    proxyEvent: expect.any(Object),
    proxyEventV2: expect.any(Object),
  }))
})
