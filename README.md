# GestionIcfes

Sistema web para la gestión académica de instituciones de preparación para el examen ICFES. Permite administrar estudiantes, docentes, simulacros, asistencias y materiales de estudio desde un panel centralizado con control de acceso por roles.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Java 21 · Spring Boot 4.0.6 · Spring Security · Spring Data JPA |
| Frontend | Thymeleaf · Bootstrap · CSS personalizado |
| Base de datos | PostgreSQL 15+ |
| Build | Maven 3.9+ |
| Otros | Lombok · DevTools · thymeleaf-extras-springsecurity6 |

---

## Funcionalidades por rol

### Administrador
- Gestión completa de estudiantes y docentes (crear, editar, eliminar)
- Registro y administración de instituciones con fechas de inicio y cierre
- Creación de simulacros y carga de resultados en PDF por estudiante
- Registro de asistencias diarias por salón
- Subida de materiales de estudio por semana
- Panel de configuración: cambio de contraseña, activar/desactivar usuarios, restablecer contraseñas
- Log de auditoría de todas las acciones del sistema

### Docente
- Panel con resumen de progreso de la institución
- Cambio de nombre de usuario y contraseña propios

### Estudiante
- Consulta de simulacros y descarga de resultados en PDF
- Historial de asistencias
- Acceso a materiales de estudio por semana
- Cambio de nombre de usuario y contraseña propios

### Automatización
- Cierre automático de instituciones: al llegar la `fechaFinal`, todos los usuarios asociados son desactivados automáticamente cada noche a medianoche.

---

## Requisitos previos

- Java 21
- Maven 3.9+
- PostgreSQL 15+ corriendo en `localhost:5432`

---

## Configuración y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/MiguelMD06/ProyectoIngSoftw.git
cd ProyectoIngSoftw
```

### 2. Crear la base de datos

```sql
CREATE DATABASE gestionicfes;
```

### 3. Configurar credenciales de base de datos

Editar `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gestionicfes
spring.datasource.username=postgres
spring.datasource.password=TU_CONTRASEÑA
```

### 4. Ejecutar la aplicación

```bash
mvn spring-boot:run
```

El esquema de tablas se crea automáticamente (Hibernate DDL `update`). Los roles y el usuario administrador por defecto se inicializan solos en el primer arranque — no se requiere ningún SQL manual.

La aplicación queda disponible en: **http://localhost:8080**

---

## Credenciales por defecto

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `Aldemar` | `AFC` |

> Las contraseñas de estudiantes y docentes recién creados son su número de documento de identidad.

---

## Comandos útiles

```bash
# Compilar y empaquetar
mvn clean package

# Ejecutar tests (requiere PostgreSQL activo)
mvn test

# Ejecutar una clase de test específica
mvn test -Dtest=GestionIcfesApplicationTests
```

---

## Internacionalización

La aplicación soporta cuatro idiomas. Para cambiar el idioma, agregar `?lang=` a cualquier URL:

| Parámetro | Idioma |
|---|---|
| `?lang=es` | Español (predeterminado) |
| `?lang=en` | English |
| `?lang=fr` | Français |
| `?lang=it` | Italiano |

---

## Estructura del proyecto

```
src/main/java/co/edu/local/gestionIcfes/
├── config/         → Seguridad, internacionalización, inicialización de datos
├── controller/     → Controladores MVC por rol (Admin, Docente, Estudiante, Usuario)
├── dto/            → Objetos de transferencia de datos para formularios
├── enums/          → TipoIdentificacion, EstadoInstitucion, EstadoAsistencia
├── model/          → Entidades JPA
├── repository/     → Repositorios Spring Data JPA
├── services/       → Interfaces de servicios
└── servicesImpl/   → Implementaciones de servicios + scheduler de cierre

src/main/resources/
├── templates/      → Vistas Thymeleaf organizadas por rol
├── static/         → CSS, JS e imágenes
└── messages*.properties → Traducciones (es, en, fr, it)
```

---

## Seguridad

El acceso está protegido por Spring Security con autenticación por formulario y redirección por rol:

| Ruta | Rol requerido |
|---|---|
| `/admin/**` | ROLE_ADMIN |
| `/docente/**` | ROLE_DOCENTE |
| `/estudiante/**` | ROLE_ESTUDIANTE |
| `/login`, recursos estáticos | Público |

Las contraseñas se almacenan con BCrypt.

---

## Equipo de desarrollo

Proyecto académico desarrollado para la asignatura de Programación Web — Universidad Surcolombiana (USCO).
