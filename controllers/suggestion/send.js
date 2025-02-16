const nodemailer = require("nodemailer");
const ModelUser = require("../../models/user");
const Joi = require("joi");

const userSchema = Joi.object({
  message: Joi.string().min(30).max(600).required().messages({
    "string.base": "Mesaj bir metin olmalıdır",
    "string.min": "Mesaj en az 30 karakter uzunluğunda olmalıdır",
    "string.max": "Mesaj en fazla 600 karakter uzunluğunda olmalıdır",
    "any.required": "Mesaj gereklidir",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email boş bırakılamaz",
    "any.required": "Email gereklidir",
    "string.email": "Geçerli bir e-posta adresi giriniz",
  }),
});

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_RECIPIENT,
  SMTP_FROM,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

module.exports = async function (req, res, next) {
  try {
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { _id } = res.locals.user;

    let user = await ModelUser.find({ _id });

    if (!user) throw new Error("Kullanıcı bulunamadı!");

    const mailOptions = {
      from: SMTP_FROM,
      to: SMTP_RECIPIENT,
      subject: "Depom projesine öneri geldi!",
      text: `Kullanıcı ID: ${_id}\nAd: ${user[0]._doc.firstname}\nSoyad: ${user[0]._doc.lastname}\nKullanıcı adı: ${user[0]._doc.username}\nE-posta: ${value.email}\n\nMesaj:\n${value.message}`,
    };

    console.log("Mail options:", mailOptions); // Log mail options for debugging

    transporter.sendMail(mailOptions, (error, _info) => {
      if (error) {
        console.error(error);
        return res.status(500).send({ error: "Bilinmeyen bir hata oluştu!" });
      }
      res.send();
    });
  } catch (error) {
    return next(error);
  }
};
