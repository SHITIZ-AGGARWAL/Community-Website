const argon2 = require('argon2');
const Admin = require('../../models/Admin');
const { ErrorHandler } = require('../../../helpers/error');
const constants = require('../../../constants');

module.exports = async (req, res, next) => {
  const { email, password } = req.body;
  const userRecord = await Admin.findOne({ email });
  if (!userRecord) {
    const error = new ErrorHandler(constants.ERRORS.INPUT, {
      statusCode: 400,
      message: 'Invalid login credentials',
      user: email,
      errStack: 'Auth Login',
    });
    next(error);
    return false;
  }
  const isPasswordCorrect = await argon2.verify(
    userRecord.passwordHash,
    password
  );
  if (!isPasswordCorrect) {
    const error = new ErrorHandler(constants.ERRORS.INPUT, {
      statusCode: 400,
      message: 'Invalid login credentials',
      user: email,
      errStack: 'Auth Login',
    });
    next(error);
    return false;
  }

  return res.status(204).send();
};