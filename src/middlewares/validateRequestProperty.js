const Ajv = require("ajv");

const ajv = new Ajv({ allErrors: true, strict: false });
require("ajv-formats")(ajv);

const BadRequestError = require("../errors/badRequest");

const validateRequestProperty =
  (errorCode, schema, target) => (req, res, next) => {
    const valid = ajv.validate(schema, req[target]);

    if (!valid) {
      const message = ajv.errorsText();
      next(new BadRequestError(message, errorCode));
      return;
    }

    next();
  };

module.exports = validateRequestProperty;
