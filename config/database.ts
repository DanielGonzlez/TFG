import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'mysql', // o 'postgres' como predeterminado
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_MYSQL_HOST'),
        port: Number(env.get('DB_MYSQL_PORT')), // Convertir a número
        user: env.get('DB_MYSQL_USER'),
        password: env.get('DB_MYSQL_PASSWORD'),
        database: env.get('DB_MYSQL_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations/mysql'],
      },
    },
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_POSTGRES_HOST'),
        port: Number(env.get('DB_POSTGRES_PORT')), // Convertir a número
        user: env.get('DB_POSTGRES_USER'),
        password: env.get('DB_POSTGRES_PASSWORD'),
        database: env.get('DB_POSTGRES_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations/postgres'],
      },
    },
  },
})

export default dbConfig