const Joi = require("joi");
const md5 = require("md5");
const ModelUser = require("../../models/user");

const userSchema = Joi.object({
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
});

module.exports = async function (req, res, next) {
  try {
    const user = res.locals.user;
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const oldPassword = md5(value.oldPassword);

    if (oldPassword !== user.password) throw new Error("Eski şifre yanlış!");

    const newPassword = md5(value.newPassword);

    const updatedUser = await ModelUser.findByIdAndUpdate(user._id, {
      password: newPassword,
    });

    if (!updatedUser) throw new Error("Kullanıcı bulunamadı!!!");

    res.send();
  } catch (error) {
    return next(error);
  }
};
