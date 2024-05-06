import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  DB_SERVER: string;
  SALT: string;
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  DB_SERVER: {
    doc: 'Database server IP-address',
    format: 'ipaddress',
    env: 'DB_SERVER',
    default: '127.0.0.1'
  },
  SALT: {
    doc: 'Random string',
    format: String,
    env: 'SALT',
    default: null
  }
});
