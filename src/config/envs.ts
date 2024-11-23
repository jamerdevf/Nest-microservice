
import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    DB_PASSWORD: string;
    DB_NAME: string;
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required()
})
.unknown(true); // hay más variables de node que van a venir

const { error, value } = envSchema.validate( process.env );

if ( error ){
    throw new Error(`Config valodation error: ${ error.message }`)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    database_url: envVars.DATABASE_URL,
    db_password: envVars.DB_PASSWORD,
    db_name: envVars.DB_NAME
}