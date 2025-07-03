import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        detalles: path.resolve(__dirname, 'detalles.html'),
        favoritos:path.resolve(__dirname, 'favoritos.html')
      }
    }
  }
})

//Esta es la configuración de vite que tuve que hacer para que sean servidos correctamente ambos html, de lo contrario tenía errores en producción, los cuales pude ver haciendo uso de npm run preview. Simplemente agrega las rutas para que no rompa ni lance errores.
