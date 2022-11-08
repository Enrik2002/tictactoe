export default {
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'tictactoe',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],


  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: "AIzaSyDdlw8k9XcNd3F_b2CJ6junWiCQSbiqQq8",
          authDomain: "tictactoe-ef6cf.firebaseapp.com",
          projectId: "tictactoe-ef6cf",
          storageBucket: "tictactoe-ef6cf.appspot.com",
          messagingSenderId: "242389883836",
          appId: "1:242389883836:web:7646e63359525629fde9b9",
          measurementId: "G-X97E2JS4TD"
        },
        services: {
          auth: {
            initialize: {
              onAuthStateChangedMutation: "ON_AUTH_STATE_CHANGED_MUTATION",
            }
            
          },
          firestore: true// Just as example. Can be any other service.
        }
      }
    ]
  ],


  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
