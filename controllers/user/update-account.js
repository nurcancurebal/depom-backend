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
    const userId = res.locals.user._id;

    delete req.body.password;

    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    value.birthdate.setHours(
      value.birthdate.getHours() - value.birthdate.getTimezoneOffset() / 60
    );

    const data = {
      username: value.username,
      firstname: value.firstname,
      lastname: value.lastname,
      birthdate: value.birthdate,
    };

    const findUser = await ModelUser.findByIdAndUpdate(userId, data);

    if (!findUser) {
      throw new Error("Kullanıcı bulunamadı!!!");
    }

    res.send();
  } catch (error) {
    return next(error);
  }
};
