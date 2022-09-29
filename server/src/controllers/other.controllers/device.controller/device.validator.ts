import Joi from "joi";

export const computer_company = (data: any): Joi.ValidationResult => {
  const schema = Joi.object().keys({
    name: Joi.string().required().trim()
  });
  return schema.validate(data);
};

export const computer_type = (data: any): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        type: Joi.string().required().trim()
    });
    return schema.validate(data);
};

export const phone_company = (data: any): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        name: Joi.string().required().trim()
    });
    return schema.validate(data);
};

export const phone_type = (data: any): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        type: Joi.string().required().trim()
    });
    return schema.validate(data);
};