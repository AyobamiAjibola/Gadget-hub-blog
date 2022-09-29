import Joi from "joi";
export const userRoles = (data: any): Joi.ValidationResult => {
  const schema = Joi.object().keys({
    userType: Joi.string().required().trim()
  });
  return schema.validate(data);
};