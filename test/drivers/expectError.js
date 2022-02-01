const {expect} = require('chai')

const expectError = async ({
  expectedStatusCode = 400,
  expectedCode,
  expectedMessage,
  response,
}) => {
  expect(response.status).to.equal(expectedStatusCode)

  const {errorCode, message, traceId} = await response.json()

  expect(errorCode).to.not.be.undefined
  expect(errorCode).to.equal(expectedCode)
  expect(message).to.not.be.undefined
  expect(message).to.equal(expectedMessage)
  expect(traceId).to.not.be.undefined
}

module.exports = expectError
