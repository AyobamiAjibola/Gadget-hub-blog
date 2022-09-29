import Joi from "joi";
export const newPost = (data: any): Joi.ValidationResult => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    post: Joi.string().required(),
    image: Joi.string().optional().allow(''),
    category: Joi.string().required(),
  });
  return schema.validate(data);
};

export const updatePost = (data: any): Joi.ValidationResult => {
  const schema = Joi.object().keys({
    title: Joi.string(),
    post: Joi.string(),
    image: Joi.string().optional().allow(''),
    category: Joi.string(),
  });
  return schema.validate(data);
};