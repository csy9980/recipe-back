const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "유효한 이메일 형식이 아닙니다.",
    "string.empty": "이메일을 입력해주세요.",
  }),
  password: Joi.string().min(6).max(20).required().messages({
    "string.min": "비밀번호는 최소 6자리 이상 입력해주세요.",
    "string.max": "비밀번호는 최대 20자리까지 입력가능합니다.",
    "string.empty": "비밀번호를 입력해주세요.",
  }),
  name: Joi.string().min(2).max(10).required().messages({
    "string.min": "이름은 최소 2자 이상 입력해주세요.",
    "string.max": "이름은 최대 10자까지 입력가능합니다.",
    "string.empty": "이름을 입력해주세요",
  }),
});

module.exports = {
  registerSchema,
};
