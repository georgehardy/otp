const {camelToSnake, snakeToCamel} = require('./util/knex-converters')

// This hook is provided by Knex. It allows us to modify the format of the
// result before it's used.
// Ref: https://knexjs.org/#Installation-post-process-response
const postProcessResponse = result =>
  Array.isArray(result)
    ? result.map(row => snakeToCamel(row))
    : result

// Another hook, this time for processing data on the way in to Knex. We can
// leverage it to convert camelCase to snake_case.
// Ref: https://knexjs.org/#Installation-wrap-identifier
const wrapIdentifier = (identifier, origImpl) => origImpl(camelToSnake(identifier))

module.exports = {
  // development: {
  //   client: 'pg',
  //   connection: 'postgres://localhost/george',
  //   migrations: {
  //     directory: __dirname + '/migrations'
  //   },
  //   seeds: {
  //     directory: __dirname + '/seeds'
  //   },
  //   postProcessResponse,
  //   wrapIdentifier
  // },

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true,
    postProcessResponse,
    wrapIdentifier
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    postProcessResponse,
    wrapIdentifier
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    postProcessResponse,
    wrapIdentifier
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    postProcessResponse,
    wrapIdentifier
  }

  // onUpdateTrigger: table => `
  //   CREATE TRIGGER ${table}_updated_at
  //   BEFORE UPDATE ON ${table}
  //   FOR EACH ROW
  //   EXECUTE PROCEDURE on_update_timestamp();
  // `
}
