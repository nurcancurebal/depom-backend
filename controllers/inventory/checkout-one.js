const Joi = require("joi");
const ModelInventory = require("../../models/inventory");

const inventorySchema = Joi.object({
  productname: Joi.string().required(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  supplier: Joi.string().required(),
  brand: Joi.string().required(),
  unit: Joi.string().required(),
  quantity: Joi.number().required(),
  unitprice: Joi.number().required(),
});

module.exports = async function (req, res, next) {
  try {
    const barcode = req.params.barcode;
    const userId = res.locals.user._id;

    const { error, value } = inventorySchema.validate(req.body);

    if (error) {
      const errorMessage = translateErrorMessage(error.details[0].message);
      throw new Error(errorMessage);
    }

    const data = {
      userId,
      barcode,
      productname: value.productname,
      category: value.category,
      subcategory: value.subcategory,
      supplier: value.supplier,
      brand: value.brand,
      unit: value.unit,
      quantity: value.quantity,
      unitprice: value.unitprice,
      process: "checkout",
    };

    const result = await ModelInventory.create(data);

    return res.send(result);
  } catch (error) {
    return next(error);
  }
};

function translateErrorMessage(message) {
  const translations = {
    '"productname" is required': '"Ürün adı" gereklidir',
    '"productname" is not allowed to be empty': "Ürün adı boş bırakılamaz",
    '"productname" must be a string': "Ürün adı bir metin olmalıdır",
    '"category" is not allowed to be empty': "Kategori boş bırakılamaz",
    '"category" is required': "Kategori gereklidir",
    '"category" must be a string': "Kategori bir metin olmalıdır",
    '"subcategory" is not allowed to be empty': "Alt kategori boş bırakılamaz",
    '"subcategory" is required': "Alt kategori gereklidir",
    '"subcategory" must be a string': "Alt kategori bir metin olmalıdır",
    '"supplier" is not allowed to be empty': "Tedarikçi boş bırakılamaz",
    '"supplier" is required': "Tedarikçi gereklidir",
    '"supplier" must be a string': "Tedarikçi bir metin olmalıdır",
    '"brand" is not allowed to be empty': "Marka boş bırakılamaz",
    '"brand" is required': "Marka gereklidir",
    '"brand" must be a string': "Marka bir metin olmalıdır",
    '"unit" is not allowed to be empty': "Birim boş bırakılamaz",
    '"unit" is required': '"Birim" gereklidir',
    '"unit" must be a string': '"Birim" bir metin olmalıdır',
    '"quantity" is not allowed to be empty': "Miktar boş bırakılamaz",
    '"quantity" is required': "Miktar gereklidir",
    '"quantity" must be a number': "Miktar bir sayı olmalıdır",
    '"unitprice" is not allowed to be empty': "Birim fiyat boş bırakılamaz",
    '"unitprice" is required': "Birim fiyat gereklidir",
    '"unitprice" must be a number': "Birim fiyat bir sayı olmalıdır",
  };

  return translations[message] || message;
}
