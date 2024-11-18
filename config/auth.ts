import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import type { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'

// Configuración de autenticación
const authConfig = defineConfig({
  default: 'web',  // Usamos el guard 'web' para la autenticación basada en cookies

  //! SE HA IMPLEMENTADO UNA AUTENTICACIÓN BASADA EN SESION DE USUARIOS
  guards: {
    // Guard para sesiones (con cookies)
    web: sessionGuard({
      useRememberMeTokens: true,  // Habilitamos los tokens de "remember me" para sesiones persistentes
      provider: sessionUserProvider({
        model: () => import('#models/user_model'),  // Usamos el modelo User para la autenticación
      }),
    }),

    // Guard para tokens (por si necesitas otro tipo de autenticación en API
  },
})

export default authConfig

/**
 * Inferimos los tipos de autenticadores desde la configuración definida
 */
declare module '@adonisjs/auth/types' {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}

declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
