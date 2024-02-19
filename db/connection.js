const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

console.log(`The environment is ${ENV}`);
console.log(`the path is ${__dirname}/../.env.${ENV}`);
console.log(`the database is ${process.env.PGDATABASE}`);

module.exports = new Pool();
