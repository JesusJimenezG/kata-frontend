# Kata Frontend - Resource Management & Reservation Platform

This is the frontend for the Fullstack Resource Management and Reservation Platform challenge.

## Project Structure

- `app/`: React Native (Expo) application.
- `REQUIREMENTS.md`: Detailed project requirements and objectives.

## Setup Instructions

1.  Navigate to the `app` directory:
    ```bash
    cd app
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Start the Expo development server:
    ```bash
    pnpm start
    ```

## Technologies

- React Native (Expo)
- TypeScript

## AI Usage

- **UI/UX**: Implementación de banners de error inline para retroalimentación de API.

- **Documentación y Reglas**: Se han generado las instrucciones de Copilot y las reglas de desarrollo, workflow de Git y requisitos funcionales utilizando GitHub Copilot. Se han organizado los archivos en `.github/instructions` para una mejor gestión de las reglas del agente y se han validado las rutas y convenciones del proyecto.
- **Componentes UI**: Creación de una biblioteca de componentes reutilizables (Button, Input, Card, Badge, Modal, etc.) utilizando NativeWind para asegurar consistencia visual y reducir código duplicado. Se utilizó criterio humano para ajustar los estilos de Tailwind a las necesidades de React Native.
- **Flujo de Navegación**: Configuración de Expo Router con layouts dinámicos para proteger rutas privadas (Auth Guard) y organizar la aplicación en pestañas (Tabs), optimizando la estructura de archivos según las convenciones de Expo 54.
- **Módulos de Negocio**: Implementación de pantallas funcionales para CRUD de recursos, gestión de reservas y visualización de disponibilidad, integrando hooks de React Query para el estado del servidor y asegurando un manejo de errores robusto.
- **Utilidades y Validación**: Creación de helpers para manejo de fechas ISO-8601 y validaciones robustas en formularios para mejorar la experiencia de usuario (UX), aplicando mejores prácticas de React para evitar re-renders innecesarios.
