import Joi from "joi";
export const postAdmin = (data: any): Joi.ValidationResult => {
  const schema = Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .required(),
    confirmPassword: Joi.ref('password'),
    isAdmin: Joi.boolean(),
    uniqueValue: Joi.string().required(),
    role: Joi.string().required()
  });
  return schema.validate(data);
};

export const postUser = (data: any): Joi.ValidationResult => {
    const schema = Joi.object().keys({
      fullName: Joi.string().required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
        .required(),
      confirmPassword: Joi.ref('password'),
      isAdmin: Joi.boolean(),
      role: Joi.string().required()
    });
    return schema.validate(data);
  };

  export const updateUser = (data: any): Joi.ValidationResult => {
    const schema = Joi.object().keys({
      fullName: Joi.string(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
      confirmPassword: Joi.ref('password'),
      isAdmin: Joi.boolean(),
      role: Joi.string()
    });
    return schema.validate(data);
  };