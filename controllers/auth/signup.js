const md5 = require("md5");
const Joi = require("joi");

const ModelUser = require("../../models/user");

const userSchema = Joi.object({
  username: Joi.string()
    .min(6)
    .max(18)
    .regex(/^[a-zA-Z0-9]*$/)
    .required()
    .messages({
      "string.base": "Kullanıcı adı bir metin olmalıdır",
      "string.empty": "Kullanıcı adı boş bırakılamaz",
      "string.min": "Kullanıcı adı en az 6 karakter uzunluğunda olmalıdır",
      "string.max": "Kullanıcı adı en fazla 18 karakter uzunluğunda olmalıdır",
      "string.pattern.base":
        "Kullanıcı adı Türkçe karakterler içeremez ve sadece İngilizce harfler ile rakamlar içermelidir",
      "any.required": "Kullanıcı adı gereklidir",
    }),
  password: Joi.string()
    .min(6)
    .max(18)
    .regex(/^[a-zA-Z0-9]*$/)
    .required()
    .messages({
      "string.base": "Şifre bir metin olmalıdır",
      "string.min": "Şifre en az 6 karakter uzunluğunda olmalıdır",
      "string.max": "Şifre en fazla 18 karakter uzunluğunda olmalıdır",
      "string.pattern.base":
        "Şifre Türkçe karakterler içeremez ve sadece İngilizce harfler ile rakamlar içermelidir",
      "string.empty": "Şifre boş bırakılamaz",
      "any.required": "Şifre gereklidir",
    }),
  firstname: Joi.string().min(1).required().messages({
    "string.empty": "Ad boş bırakılamaz",
    "any.required": "Ad gereklidir",
  }),
  lastname: Joi.string().min(1).required().messages({
    "string.empty": "Soyad boş bırakılamaz",
    "any.required": "Soyad gereklidir",
  }),
  birthdate: Joi.date().iso().required().empty("").messages({
    "date.empty": "Doğum tarihi boş bırakılamaz",
    "date.format": "Doğum tarihi geçerli bir tarih olmalıdır",
    "any.required": "Doğum tarihi gereklidir",
  }),
});

module.exports = async function (req, res, next) {
  try {
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    value.birthdate.setHours(
      value.birthdate.getHours() - value.birthdate.getTimezoneOffset() / 60
    );

    const data = {
      username: value.username,
      password: md5(value.password),
      firstname: value.firstname,
      lastname: value.lastname,
      birthdate: value.birthdate,
    };

    let result = await ModelUser.create(data);

    res.send(result);
  } catch (error) {
    error.status = 400;
    return next(error);
  }
};
