import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

import { DB_NAMES } from '#utils/dictionaries/databases_conections'
import { DB_CONNECTIONS } from '#utils/dictionaries/databases_conections'

const dbConfig = defineConfig({
  connection: DB_CONNECTIONS.MYSQL,  // MariaDB es la conexión predeterminada
  connections: {
    mysql: {
      client: DB_NAMES.MYSQL2,
      connection: {
        host: env.get('DB_HOST'),
        port: Number(env.get('DB_PORT')),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations/mariadb'],  // Rutas específicas para MariaDB
      },
      seeders: {
        paths: ['database/seeders/mariadb'],  // Rutas específicas para los seeders de MariaDB
      },
    },
    postgresql: {  // Asegúrate de usar 'postgresql' aquí
      client: DB_NAMES.POSTGRESQL,
      connection: {
        host: env.get('PG_HOST'),
        port: Number(env.get('PG_PORT')),
        user: env.get('PG_USER'),
        password: env.get('PG_PASSWORD'),
        database: env.get('PG_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations/postgresql'],  // Rutas específicas para PostgreSQL
      },
      seeders: {
        paths: ['database/seeders/postgresql'],  // Rutas específicas para los seeders de Postgresql
      },
    },
  },
})

export default dbConfig
