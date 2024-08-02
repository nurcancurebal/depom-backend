const Joi = require("joi");
const ModelInventory = require("../../models/inventory");

const inventorySchema = Joi.object({
  barcode: Joi.string().required(),
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
    const userId = res.locals.user._id;

    const { error, value } = inventorySchema.validate(req.body);

    if (error) {
      const errorMessage = translateErrorMessage.details[0].message;
      throw new Error(errorMessage);
    }

    const data = {
      userId,
      barcode: value.barcode,
      productname: value.productname,
      category: value.category,
      subcategory: value.subcategory,
      supplier: value.supplier,
      brand: value.brand,
      unit: value.unit,
      quantity: value.quantity,
      unitprice: value.unitprice,
      process: "entry",
    };

    const result = await ModelInventory.create(data);

    return res.send(result);
  } catch (error) {
    return next(error);
  }
};

function translateErrorMessage(message) {
  const translations = {
    '"barcode" is required': '"Barkod" gereklidir',
    '"barcode" must be a string': '"Barkod" bir metin olmalıdır',
    '"category" is required': '"Kategori" gereklidir',
    '"category" must be a string': '"Kategori" bir metin olmalıdır',
    '"subcategory" is required': '"Alt kategori" gereklidir',
    '"subcategory" must be a string': '"Alt kategori" bir metin olmalıdır',
    '"supplier" is required': '"Tedarikçi" gereklidir',
    '"supplier" must be a string': '"Tedarikçi" bir metin olmalıdır',
    '"brand" is required': '"Marka" gereklidir',
    '"brand" must be a string': '"Marka" bir metin olmalıdır',
    '"unit" is required': '"Birim" gereklidir',
    '"unit" must be a string': '"Birim" bir metin olmalıdır',
    '"quantity" is required': '"Miktar" gereklidir',
    '"quantity" must be a number': '"Miktar" bir sayı olmalıdır',
    '"unitprice" is required': '"Birim fiyatı" gereklidir',
    '"unitprice" must be a number': '"Birim fiyatı" bir sayı olmalıdır',
  };

  return translations[message] || message;
}
