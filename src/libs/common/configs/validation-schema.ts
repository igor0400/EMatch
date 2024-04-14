import * as Joi from 'joi';

export const validationSchema = Joi.object({
  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.number().required(),
  MYSQL_USERNAME: Joi.string().required(),
  MYSQL_DBNAME: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),

  PORT: Joi.number().required(),
  ADMIN_USERNAME: Joi.string().required(),
  ADMIN_TG_ID: Joi.string().required(),

  BOT_TOKEN: Joi.string().required(),
  BANNER_URL: Joi.string().optional(),

  CHANNEL_ID: Joi.string().required(),
  BACKEND_URL: Joi.string().optional(),
});
