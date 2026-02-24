# Frontend Vue para e-commerce

Esta carpeta contiene la aplicación frontend construida con Vue.js y estilizada con Tailwind CSS. Se conecta con la API del backend para ofrecer la interfaz de un comercio electrónico sencillo, incluyendo login/registro, listado de productos, carrito de compras y administración cuando se ha iniciado sesión como usuario con rol de administrador.

## 🗂️ Estructura principal

```
src/
  ├─ api/           # Módulos para llamadas HTTP al backend (auth, productos, categorías, pedidos)
  ├─ components/    # Componentes reutilizables (Navbar, etc.)
  ├─ router/        # Definición de rutas de la aplicación
  ├─ stores/        # Pinia/Vuex para estado global (autenticación, carrito)
  ├─ views/         # Vistas por página, organizadas en subcarpetas (admin, client, auth)
  └─ assets/        # CSS global, imágenes, etc.

public/             # Archivos estáticos como index.html

tests/              # Pruebas unitarias con Jest

vue.config.js, tailwind.config.js  # Configuraciones del proyecto
```

## 📦 Instalación y uso

1. Instala dependencias:

```bash
npm install
```

2. Levanta el servidor de desarrollo con recarga en caliente:

```bash
npm run serve
```

La aplicación quedará disponible en `http://localhost:8080` por defecto.

3. Para generar una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados se colocan en la carpeta `dist/`.

4. Ejecuta las pruebas unitarias:

```bash
npm run test:unit
```

## 🔧 Configuración personalizada

Consulta la referencia de configuración de Vue CLI para modificar `vue.config.js` u otras opciones:
https://cli.vuejs.org/config/

También se utiliza Tailwind CSS; revisa `tailwind.config.js` para ajustes de estilos.

## 🧠 Cómo funciona la aplicación

- **Autenticación**: `src/api/auth.js` interactúa con el backend para login/registro. El token JWT se almacena en el estado global (`stores/auth.js`) y se adjunta a las peticiones con Axios.
- **Rutas protegidas**: El router define guards que verifican el estado de autenticación y el rol del usuario para acceder a vistas de administración.
- **Carrito de compras**: Gestionado en `stores/cart.js`; permite agregar, eliminar productos y crear pedidos.
- **Vistas de administrador**: Presentan tablas y formularios para crear/editar categorías, productos y ver pedidos (carpetas `views/admin`).
- **Estilos**: Tailwind CSS proporciona utilidades para diseño responsivo.

## 📚 Notas finales

- Asegúrate de tener el backend corriendo y la URL base configurada en `src/api/axios.js`.
- Puedes ampliar componentes o crear nuevas rutas según tus necesidades.

---

¡Ahora tu proyecto frontend está listo para desarrollar y desplegar! Sigue explorando y adaptando según tu e-commerce.✨