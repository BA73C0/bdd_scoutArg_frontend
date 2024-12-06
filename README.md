# Football Website Frontend

Este repositorio contiene la infraestructura del frontend de una página web de fútbol, construida con **React**. La interfaz de usuario está diseñada para ser dinámica, interactiva y responsiva, permitiendo a los usuarios interactuar con los datos de jugadores y equipos del ascenso argentino.

---

## Autores

| Nombre        | Apellido   | Padrón | Gmail                 |
| ------------- | ---------- | ------ | --------------------- |
| Joaquin       | Batemarco  | 110222 | jbatemarco@fi.uba.ar  |
| Franco Ariel  | Alani      | 111147 | falani@fi.uba.ar      |
| Franco Martin | Fusco      | 102692 | ffusco@fi.uba.ar      |
| Benicio       | Braunstein | 110126 | bbraunstein@fi.uba.ar |
| Juan Martin   | de la Cruz | 109588 | jdelacruz@fi.uba.ar   |
| Theo          | Lijs       | 109472 | tlijs@fi.uba.ar       |

---

## Tabla de Contenidos

1. [Estructura del Repositorio](#estructura-del-repositorio)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración del Proyecto](#configuración-del-proyecto)
    - 3.1. [Instalar Dependencias del Proyecto](#instalar-dependencias-del-proyecto)
    - 3.2. [Configurar las Variables de Entorno](#configurar-las-variables-de-entorno)
4. [Compilar y Ejecutar el Proyecto](#compilar-y-ejecutar-el-proyecto)
    - 4.1. [Modo de Desarrollo](#modo-de-desarrollo)
    - 4.2. [Modo de Producción](#modo-de-producción)
5. [Consideraciones de las Variables de Entorno](#consideraciones-de-las-variables-de-entorno)
6. [Contribuir](#contribuir)
7. [Licencia](#licencia)

---

## Estructura del Repositorio

```plaintext
├── public/               # Archivos públicos accesibles
│   ├── background.jpg    # Imagen de fondo del sitio
│   ├── favicon.ico       # Icono del sitio
│   ├── index.html        # Archivo principal HTML
│   ├── jugador.png       # Imagen relacionada con el jugador
│   ├── logo192.png       # Logo en formato 192x192
│   ├── logo512.png       # Logo en formato 512x512
│   ├── manifest.json     # Archivo de configuración para la PWA
│   └── robots.txt        # Archivo para configurar robots de búsqueda
├── src/                  # Código fuente de la aplicación
│   ├── components/       # Componentes de la interfaz de usuario
│   ├── pages/            # Páginas del sitio web
│   ├── App.css           # Estilos globales de la aplicación
│   ├── App.js            # Componente principal de la aplicación
│   ├── App.test.js       # Pruebas para el componente App
│   ├── index.css         # Estilos para el archivo index
│   ├── index.js          # Punto de entrada principal de la aplicación
│   ├── logo.svg          # SVG del logo
│   ├── reportWebVitals.js# Archivo para medir el rendimiento
│   ├── setupTests.js     # Configuración para pruebas
│   ├── supabaseContext.js# Contexto para la conexión con Supabase
│   └── utils.js          # Funciones y utilidades generales
├── .env                  # Variables de entorno
├── .gitignore            # Archivos y carpetas ignoradas por Git
├── LICENSE               # Licencia del proyecto
├── README.md             # Documentación del proyecto
├── package.json          # Dependencias y scripts del proyecto
└── package-lock.json     # Archivo de bloqueo de dependencias
```

---

## Requisitos Previos

Antes de comenzar con el proyecto, asegúrate de tener las siguientes herramientas instaladas:

- **Node.js**: Instalar desde [https://nodejs.org/](https://nodejs.org/)
- **npm**: Instalar o actualizar a la versión más reciente con el siguiente comando:

```bash
$ npm install -g npm@latest
```

---

## Configuración del Proyecto

### 1. Instalar Dependencias del Proyecto

Luego de clonar o descargar el repositorio, navega al directorio del proyecto e instala las dependencias ejecutando:

```bash
$ npm install
```

### 2. Configurar las Variables de Entorno

Crea un archivo `.env` en el directorio raíz del proyecto y configura las siguientes variables de entorno:

```bash
# ./ .env
## APP API URL
REACT_APP_API_URL=http://localhost:3000

## URL y Clave de Supabase
REACT_APP_SUPABASE_URL="your_supabase_url"
REACT_APP_SUPABASE_KEY="your_supabase_key"

## ID del Administrador
REACT_APP_ADMIN_ID="your_admin_id"
```

> **Importante**: Reemplaza los valores con los datos correctos de tu proyecto Supabase y el ID del administrador.

---

## Compilar y Ejecutar el Proyecto

### Modo de Desarrollo

Para ejecutar el proyecto en modo de desarrollo, que recargará automáticamente la página cuando se realicen cambios en el código, ejecuta:

```bash
$ npm run start
```

El proyecto estará disponible en [http://localhost:3001](http://localhost:3001).

### Modo de Producción

Para construir el proyecto para producción, ejecuta:

```bash
$ npm run build
```

Esto generará una versión optimizada de la aplicación en la carpeta `build`, lista para ser desplegada.

---

## Consideraciones de las Variables de Entorno

Asegúrate de configurar correctamente las variables de entorno para la conexión con Supabase y la gestión del usuario administrador. Este paso es crucial para que la aplicación funcione correctamente con la base de datos y las funcionalidades específicas para administradores.

---

## Contribuir

Si deseas contribuir al proyecto, puedes hacerlo mediante un *fork* del repositorio y enviando un *pull request*. Por favor, asegúrate de seguir los estándares de codificación y de que todas las pruebas pasen antes de enviar tus cambios.

---

## Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

