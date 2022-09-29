import Joi from "joi";
export const newPhone = (data: any): Joi.ValidationResult => {
  const schema = Joi.object().keys({
    model: Joi.string().required(),
    deviceType: Joi.string().required(),
    brand: Joi.string().required(),
    storage: Joi.string().required(),
    ram: Joi.string().required(),
    camera: Joi.string().required(),
  });
  return schema.validate(data);
};

export const updatePhone = (data: any): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        model: Joi.string(),
        deviceType: Joi.string(),
        brand: Joi.string(),
        storage: Joi.string(),
        ram: Joi.string(),
        camera: Joi.string(),
    });
    return schema.validate(data);
};