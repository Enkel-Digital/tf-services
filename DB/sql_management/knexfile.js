// Need to run this first to ensure env vars are injected from .env file
// This is needed especially when using knex CLI, as you will not have a chance to inject in your app as it will be too late
require("dotenv").config();

// All env variables are pre-fixed with "SQL_"
const hostedDBconfig = {
  client: "postgresql",
  connection: {
    host: encodeURIComponent(process.env.SQL_HOSTNAME),
    database: encodeURIComponent(process.env.SQL_DB_NAME),
    port: encodeURIComponent(process.env.SQL_PORT),
    user: encodeURIComponent(process.env.SQL_USERNAME),
    password: encodeURIComponent(process.env.SQL_PASSWORD),
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};

// Configurations for the different Databases
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "teletif",
      port: 5432,
      user: "postgres",
      password: "password",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  staging: hostedDBconfig,
  production: hostedDBconfig,
};
