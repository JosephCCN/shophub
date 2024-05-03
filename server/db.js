//A module spcific for connecting PostgresSQL

require('dotenv').config()
const { Pool } = require('pg');


//Load DB information from dotenv and connect to the DB
const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  port: 5432, // default Postgres port
  database: process.env.DB
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};