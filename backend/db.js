const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "supplychain",
  password: "Novely25",
  port: 5432,
});

module.exports = pool;

