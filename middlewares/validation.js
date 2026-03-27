const { registerSchema } = require("../utils/validation");

const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error,
    });
  }
  next();
};

module.exports = {
  validateRegister,
};
