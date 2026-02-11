# Kata Frontend — Plataforma de Gestión y Reserva de Recursos

Aplicación móvil construida con **React Native (Expo SDK 54)** que permite a equipos reservar y administrar recursos compartidos (salas, equipos, vehículos, etc.), evitando solapamientos, mostrando disponibilidad en tiempo real y ofreciendo historial de reservas.

Este repositorio contiene exclusivamente el **frontend**. El backend es una API REST separada desarrollada con Spring Boot que debe estar corriendo en `http://localhost:8080`.

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura y Decisiones Técnicas](#arquitectura-y-decisiones-técnicas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Scripts Disponibles](#scripts-disponibles)
- [Funcionalidades](#funcionalidades)
- [Patrón de Módulos de Servicio](#patrón-de-módulos-de-servicio)
- [Convenciones de Código](#convenciones-de-código)
- [Documentación de la API](#documentación-de-la-api)
- [Uso de IA](#uso-de-ia)

---

## Descripción

La plataforma permite a los usuarios:

- **Registrarse e iniciar sesión** con email y contraseña (autenticación JWT).
- **Explorar recursos** disponibles según su rol (salas, equipos, vehículos, etc.).
- **Crear reservas** con fecha/hora de inicio y fin, con prevención automática de solapamientos.
- **Consultar disponibilidad** en vista de calendario/tabla por recurso.
- **Gestionar reservas** propias (ver activas, historial, cancelar).
- **Administrar recursos** (crear, editar, eliminar — solo administradores).

El sistema implementa **control de acceso basado en roles (RBAC)** con cinco niveles: `USER`, `EMPLOYEE`, `MANAGER`, `HEAD_OF_OPERATIONS` y `ADMIN`, cada uno con visibilidad y permisos diferenciados sobre los tipos de recursos.

---

## Stack Tecnológico

| Categoría           | Tecnología                                     |
| ------------------- | ---------------------------------------------- |
| **Runtime**         | React Native (Expo SDK 54) con React 19        |
| **Lenguaje**        | TypeScript con `strict: true`                  |
| **Estilos**         | NativeWind (Tailwind CSS vía prop `className`) |
| **Navegación**      | Expo Router (enrutamiento basado en archivos)  |
| **Estado servidor** | TanStack React Query v5                        |
| **HTTP**            | Axios con interceptores centralizados          |
| **Gestor paquetes** | pnpm                                           |
| **Compilador**      | React Compiler (`babel-plugin-react-compiler`) |
| **Calendario**      | react-native-calendars                         |

---

## Arquitectura y Decisiones Técnicas

### Enrutamiento basado en archivos

Se utiliza **Expo Router** para definir las rutas de la aplicación directamente desde la estructura de carpetas en `app/app/`. Las rutas públicas (`(auth)/`) y privadas (`(tabs)/`) están separadas por layouts que actúan como guards de autenticación.

### Capa de servicios API

Toda la comunicación con el backend se centraliza en `src/services/api/`. Se usa un **cliente Axios compartido** (`client.ts`) que:

- Adjunta automáticamente el token Bearer en cada petición.
- Intercepta respuestas 401 para refrescar el token de forma transparente.
- Reenvía la petición original tras el refresco exitoso.

### Estado del servidor

Se emplea **TanStack React Query** para toda la gestión de estado proveniente del servidor (caché, revalidación, mutaciones), separando claramente el estado local del estado remoto.

### React Compiler

Se usa `babel-plugin-react-compiler` para optimización automática. Esto elimina la necesidad de `useMemo`, `useCallback` y `React.memo` manuales.

### Estilos con NativeWind

Todos los componentes usan la prop `className` con clases de Tailwind CSS. No se usan objetos `style` directamente.

---

## Estructura del Proyecto

```
kata-frontend/
├── API_CONTRACT.md              ← Especificación de endpoints de la API
├── REQUIREMENTS.md              ← Requisitos completos del proyecto
├── README.md                    ← Este archivo
└── app/                         ← Raíz del proyecto Expo (ejecutar comandos aquí)
    ├── app.json                 ← Configuración de Expo
    ├── package.json             ← Dependencias y scripts
    ├── tailwind.config.js       ← Configuración de Tailwind / NativeWind
    ├── tsconfig.json            ← Configuración de TypeScript
    ├── app/                     ← Rutas basadas en archivos (Expo Router)
    │   ├── _layout.tsx          ← Layout raíz (proveedores globales)
    │   ├── index.tsx            ← Redirección inicial
    │   ├── (auth)/              ← Rutas públicas de autenticación
    │   │   ├── _layout.tsx
    │   │   ├── login.tsx
    │   │   └── register.tsx
    │   ├── (tabs)/              ← Rutas privadas con barra de pestañas
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx        ← Listado de recursos
    │   │   ├── reservations.tsx ← Mis reservas
    │   │   └── profile.tsx      ← Perfil de usuario
    │   ├── reservation/
    │   │   └── new.tsx          ← Crear nueva reserva
    │   └── resource/
    │       ├── [id].tsx         ← Detalle de recurso
    │       ├── new.tsx          ← Crear recurso (admin)
    │       └── edit/
    │           └── [id].tsx     ← Editar recurso (admin)
    └── src/
        ├── components/          ← Componentes UI reutilizables
        │   ├── Badge.tsx
        │   ├── Button.tsx
        │   ├── CalendarPicker.tsx
        │   ├── Card.tsx
        │   ├── ConfirmDialog.tsx
        │   ├── Divider.tsx
        │   ├── Dropdown.tsx
        │   ├── EmptyState.tsx
        │   ├── ErrorMessage.tsx
        │   ├── Input.tsx
        │   ├── LoadingSpinner.tsx
        │   ├── SectionHeader.tsx
        │   ├── TabBar.tsx
        │   ├── TimePicker.tsx
        │   └── index.ts         ← Barrel export
        ├── constants/           ← Constantes de la aplicación
        ├── contexts/            ← Contextos de React (AuthContext)
        ├── services/api/        ← Capa de servicios API
        │   ├── types.ts         ← Interfaces TypeScript (espejo de API_CONTRACT.md)
        │   ├── client.ts        ← Instancia Axios + interceptores
        │   ├── tokenStorage.ts  ← Wrapper de AsyncStorage para JWT
        │   ├── auth/            ← Módulo de autenticación
        │   ├── resources/       ← Módulo de recursos
        │   └── reservations/    ← Módulo de reservas
        └── utils/               ← Funciones utilitarias
            ├── dateUtils.ts     ← Formateo de fechas ISO-8601
            ├── errorUtils.ts    ← Extracción de mensajes de error
            ├── validation.ts    ← Validaciones de formularios
            └── ...
```

---

## Requisitos Previos

- **Node.js** ≥ 18
- **pnpm** (el proyecto usa `pnpm@10.28.2` como gestor de paquetes)
- **Backend** ejecutándose en `http://localhost:8080` (API Spring Boot)
- **Expo CLI** (se instala automáticamente con las dependencias)
- Para desarrollo móvil:
  - **iOS**: macOS con Xcode instalado
  - **Android**: Android Studio con un emulador configurado
  - **Expo Go**: disponible en App Store / Play Store para pruebas rápidas

---

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd kata-frontend
```

### 2. Instalar dependencias

```bash
cd app
pnpm install
```

### 3. Iniciar el backend

Asegúrate de que la API Spring Boot esté corriendo en `http://localhost:8080` antes de iniciar la aplicación.

### 4. Iniciar el servidor de desarrollo

```bash
pnpm start
```

Esto abrirá el metro bundler de Expo. Desde ahí puedes:

- Presionar `i` para abrir en el simulador de iOS.
- Presionar `a` para abrir en el emulador de Android.
- Escanear el código QR con Expo Go en tu dispositivo físico.

### 5. Ejecutar en plataforma específica

```bash
pnpm ios       # Compilar y ejecutar en iOS
pnpm android   # Compilar y ejecutar en Android
pnpm web       # Iniciar versión web
```

---

## Scripts Disponibles

| Script                       | Descripción                              |
| ---------------------------- | ---------------------------------------- |
| `pnpm start`                 | Inicia el servidor de desarrollo de Expo |
| `pnpm ios`                   | Compila y ejecuta en simulador iOS       |
| `pnpm android`               | Compila y ejecuta en emulador Android    |
| `pnpm web`                   | Inicia la versión web                    |
| `pnpm build:android`         | Genera build de Android (debug)          |
| `pnpm build:android:release` | Genera build de Android (release)        |
| `pnpm start:dev-client`      | Inicia con dev client personalizado      |

> **Nota:** Todos los comandos deben ejecutarse desde el directorio `app/`.

---

## Funcionalidades

### Autenticación

- Registro con email, contraseña, nombre y apellido.
- Inicio de sesión con email y contraseña.
- Manejo automático de tokens JWT (access + refresh).
- Cierre de sesión.
- Selección de rol al registrarse.

### Gestión de Recursos (solo admin)

- Listado de recursos con filtro por tipo.
- Vista de detalle de recurso con disponibilidad.
- Creación de nuevos recursos.
- Edición de recursos existentes.
- Eliminación (soft-delete) de recursos.
- Validación de nombres únicos con manejo de conflictos 409.

### Reservas

- Creación de reservas indicando recurso, fecha/hora de inicio y fin.
- Prevención de solapamientos (error 409 del backend).
- Listado de reservas activas propias.
- Historial de reservas pasadas.
- Cancelación de reservas (creador o admin).

### Disponibilidad

- Visualización de franjas horarias disponibles y reservadas por recurso.
- Selector de calendario para navegación por fecha.

### Control de Acceso (RBAC)

- Acciones de administración ocultas para usuarios no-admin.
- Visibilidad de recursos filtrada según el rol del usuario.

---

## Patrón de Módulos de Servicio

Cada dominio de la API (auth, resources, reservations) sigue una **estructura de 3 archivos** dentro de `src/services/api/<dominio>/`:

| Archivo       | Propósito                                         | Ejemplo          |
| ------------- | ------------------------------------------------- | ---------------- |
| `*Service.ts` | Llamadas Axios crudas, retorna datos tipados      | `authService.ts` |
| `use*.ts`     | Hooks de React Query (`useQuery` / `useMutation`) | `useAuth.ts`     |
| `index.ts`    | Barrel export del servicio y hooks                | `export { … }`   |

### Ejemplo: crear un nuevo módulo

1. Crear carpeta `src/services/api/<nuevo-dominio>/`.
2. Copiar la estructura de `auth/` y adaptar.
3. Definir los tipos en `src/services/api/types.ts`.
4. Crear un objeto de query keys: `<dominio>Keys`.
5. Re-exportar desde el `index.ts` del módulo.

---

## Convenciones de Código

- **Sin memoización manual**: React Compiler se encarga — no usar `useMemo`, `useCallback` ni `React.memo` salvo necesidad probada por profiling.
- **Barrel exports**: cada carpeta-módulo tiene un `index.ts` que re-exporta su API pública.
- **Tipos centralizados**: todas las interfaces de API viven en `services/api/types.ts`, alineadas con `API_CONTRACT.md`.
- **Manejo de tokens automático**: los interceptores de `client.ts` adjuntan el Bearer token y gestionan el refresco — los servicios no manejan tokens.
- **Estilos con `className`**: siempre usar clases NativeWind/Tailwind vía prop `className`, nunca objetos `style`.
- **TypeScript estricto**: `strict: true`, sin `any` ni `@ts-ignore`.

---

## Documentación de la API

La especificación completa de endpoints, cuerpos de request/response y códigos de error se encuentra en [API_CONTRACT.md](API_CONTRACT.md).

### Resumen de Endpoints

| Grupo              | Endpoints principales                                              |
| ------------------ | ------------------------------------------------------------------ |
| **Auth**           | `POST /api/auth/register`, `login`, `logout`, `refresh`            |
| **Tipos**          | `GET /api/resource-types`, `POST` 🔒, `PUT` 🔒, `DELETE` 🔒        |
| **Recursos**       | `GET /api/resources`, `GET /:id`, `POST` 🔒, `PUT` 🔒, `DELETE` 🔒 |
| **Reservas**       | `GET /api/reservations/*`, `POST`, `DELETE /:id/cancel`            |
| **Disponibilidad** | `GET /api/resources/:id/availability?start=...&end=...`            |

> Los endpoints marcados con 🔒 requieren rol `ROLE_ADMIN`.

### Formato de Fechas

Todas las fechas usan formato ISO-8601: `yyyy-MM-dd'T'HH:mm:ss`. En la UI se muestran en formato legible para el usuario.

---

## Uso de IA

- **UI/UX**: Implementación de banners de error inline para retroalimentación de API.

- **Documentación y Reglas**: Se han generado las instrucciones de Copilot y las reglas de desarrollo, workflow de Git y requisitos funcionales utilizando GitHub Copilot. Se han organizado los archivos en `.github/instructions` para una mejor gestión de las reglas del agente y se han validado las rutas y convenciones del proyecto.
- **Componentes UI**: Creación de una biblioteca de componentes reutilizables (Button, Input, Card, Badge, Modal, etc.) utilizando NativeWind para asegurar consistencia visual y reducir código duplicado. Se utilizó criterio humano para ajustar los estilos de Tailwind a las necesidades de React Native.
- **Flujo de Navegación**: Configuración de Expo Router con layouts dinámicos para proteger rutas privadas (Auth Guard) y organizar la aplicación en pestañas (Tabs), optimizando la estructura de archivos según las convenciones de Expo 54.
- **Módulos de Negocio**: Implementación de pantallas funcionales para CRUD de recursos, gestión de reservas y visualización de disponibilidad, integrando hooks de React Query para el estado del servidor y asegurando un manejo de errores robusto.
- **Utilidades y Validación**: Creación de helpers para manejo de fechas ISO-8601 y validaciones robustas en formularios para mejorar la experiencia de usuario (UX), aplicando mejores prácticas de React para evitar re-renders innecesarios.
- **README**: Generación de documentación completa del proyecto en español utilizando GitHub Copilot (Claude Opus 4.6), incluyendo descripción, arquitectura, instrucciones de instalación, estructura del proyecto y convenciones. Se revisó y validó manualmente la precisión técnica.
