import Joi from 'joi';
import { THEME_NAMES, FILTERS } from './config';

export const validationSchema = Joi.object().keys({
    username: Joi.string().required(),
    theme: Joi.string().valid(...THEME_NAMES).default('light'),
    animated: Joi.string().valid('true', 'false').default('false'),
    filter: Joi.string().valid(...Object.keys(FILTERS)),
    border: Joi.string().default('border'),
    json: Joi.string().valid('true', 'false').default('false')
}).unknown(true);