import Joi from "joi";
export const category = (data: any): Joi.ValidationResult => {
  const schema = Joi.object().keys({
    category: Joi.string().required().trim()
  });
  return schema.validate(data);
};