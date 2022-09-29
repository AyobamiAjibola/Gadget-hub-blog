import Joi from "joi";
export const newComputer = (data: any): Joi.ValidationResult => {
  const schema = Joi.object().keys({
    model: Joi.string().required(),
    type: Joi.string().required(),
    brand: Joi.string().required(),
    storage: Joi.string().required(),
    ram: Joi.string().required(),
    cpu: Joi.string().required(),
    gen: Joi.string().required()
  });
  return schema.validate(data);
};

export const updateComputer = (data: any): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        model: Joi.string(),
        type: Joi.string(),
        brand: Joi.string(),
        storage: Joi.string(),
        ram: Joi.string(),
        cpu: Joi.string(),
        gen: Joi.string()
    });
    return schema.validate(data);
};