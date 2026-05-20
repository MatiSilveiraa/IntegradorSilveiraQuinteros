# 🔐 Documentación: Endpoints de Autenticación y Registro

**Proyecto:** Joki - Backend  
**Módulo:** Autenticación y Registro de Usuarios  
**Fecha:** 2024  
**Estado:** Implementado ✅

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Endpoints Disponibles](#endpoints-disponibles)
3. [Registro de Alumno](#registro-de-alumno)
4. [Login de Usuario](#login-de-usuario)
5. [Logout de Usuario](#logout-de-usuario)
6. [Flujo de Autenticación Completo](#flujo-de-autenticación-completo)
7. [DTOs y Modelos](#dtos-y-modelos)
8. [Códigos de Estado HTTP](#códigos-de-estado-http)
9. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 📝 Resumen Ejecutivo

Tu aplicación tiene **dos endpoints principales de autenticación**:

### **1. Registro de Alumno** ✍️
- **URL:** `POST /api/alumno/registrar`
- **Público:** SÍ (sin autenticación)
- **Propósito:** Crear una nueva cuenta de alumno

### **2. Login** 🔑
- **URL:** `POST /api/auth/login`
- **Público:** SÍ (sin autenticación)
- **Propósito:** Obtener token JWT para autenticarse

### **3. Logout** 🚪
- **URL:** `POST /api/auth/logout`
- **Público:** NO (requiere autenticación)
- **Propósito:** Cerrar sesión y revocar token

---

## 🌐 Endpoints Disponibles

### **Resumen Rápido**

```
┌─────────────────────────────────────────────────────────┐
│  ENDPOINT                           │  AUTH  │  STATUS  │
├─────────────────────────────────────────────────────────┤
│  POST /api/alumno/registrar         │  NO    │  201     │
│  POST /api/auth/login               │  NO    │  200     │
│  POST /api/auth/logout              │  SÍ    │  200     │
└─────────────────────────────────────────────────────────┘
```

---

## ✍️ Registro de Alumno

### **Ubicación del Código**

**Archivo:** `BackEndJoki\Controllers\AlumnoController.cs`

```csharp
[HttpPost("registrar")]
public IActionResult Registrar([FromBody] RegistrarAlumnoRequest request)
{
	try
	{
		RegistrarAlumnoResponse response = _registrarAlumno.Ejecutar(request);
		return StatusCode(201, response);
	}
	catch (UsuarioRepetidoException e)
	{
		return StatusCode(409, new { mensaje = e.Message });
	}
	catch (LogicaNegocioException e)
	{
		return StatusCode(400, e.Error());
	}
	catch (Exception)
	{
		return StatusCode(500, new { mensaje = "Hubo un problema. Prueba nuevamente" });
	}
}
```

### **Request**

```http
POST /api/alumno/registrar
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@example.com",
  "password": "Password123!",
  "telefono": "+598912345678"
}
```

### **Respuesta (201 Created)**

```json
{
  "usuarioId": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@example.com",
  "telefono": "+598912345678",
  "estado": "ACTIVO",
  "rol": "Alumno"
}
```

### **Errores Posibles**

| Código | Descripción | Causa |
|--------|-------------|-------|
| `400` | Datos inválidos | Campos faltantes, formato incorrecto |
| `409` | Usuario ya existe | El email ya está registrado |
| `500` | Error del servidor | Problema interno |

### **Ejemplo de Error 409 (Duplicado)**

```json
{
  "mensaje": "El email ya está registrado"
}
```

---

## 🔑 Login de Usuario

### **Ubicación del Código**

**Archivo:** `BackEndJoki\Controllers\AuthController.cs`

```csharp
[HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest request)
{
	try
	{
		if (string.IsNullOrWhiteSpace(request.Email) ||
			string.IsNullOrWhiteSpace(request.Password))
		{
			throw new BadRequestException("Email y contraseña son obligatorios.");
		}

		DtoDatosUsuario? usuario = _loginUsuario.Ejecutar(request);

		if (usuario == null)
		{
			throw new TokenInvalidoException("Credenciales incorrectas.");
		}

		string token = _jwtGenerator.GenerateToken(usuario);
		return StatusCode(200, new { usuario, token });
	}
	catch (InfraestructuraException e)
	{
		return StatusCode(e.StatusCode(), e.Error());
	}
	catch (Exception)
	{
		return StatusCode(500, new { mensaje = "Hubo un problema. Prueba nuevamente" });
	}
}
```

### **Request**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan.perez@example.com",
  "password": "Password123!"
}
```

### **Respuesta (200 OK)**

```json
{
  "usuario": {
	"usuarioId": 1,
	"nombre": "Juan",
	"apellido": "Pérez",
	"email": "juan.perez@example.com",
	"rol": "Alumno",
	"estado": "ACTIVO"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkpvZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

### **Errores Posibles**

| Código | Descripción | Causa |
|--------|-------------|-------|
| `400` | Email y contraseña obligatorios | No envió datos |
| `401` | Credenciales incorrectas | Email o password inválidos |
| `500` | Error del servidor | Problema interno |

### **Ejemplo de Error 401**

```json
{
  "mensaje": "Credenciales incorrectas."
}
```

---

## 🚪 Logout de Usuario

### **Ubicación del Código**

**Archivo:** `BackEndJoki\Controllers\AuthController.cs`

```csharp
[Authorize]
[HttpPost("logout")]
public IActionResult Logout()
{
	try
	{
		string token = Request.Headers["Authorization"]
			.ToString()
			.Replace("Bearer ", "");

		_logoutUsuario.Ejecutar(token);

		return Ok(new
		{
			mensaje = "Sesión cerrada correctamente"
		});
	}
	catch (LogicaNegocioException e)
	{
		return BadRequest(new { mensaje = e.Message });
	}
	catch (Exception)
	{
		return StatusCode(500, new { mensaje = "Hubo un problema. Prueba nuevamente" });
	}
}
```

### **Request**

```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### **Respuesta (200 OK)**

```json
{
  "mensaje": "Sesión cerrada correctamente"
}
```

### **Errores Posibles**

| Código | Descripción | Causa |
|--------|-------------|-------|
| `401` | No autenticado | Token no válido o expirado |
| `400` | Token no válido | Token inválido |
| `500` | Error del servidor | Problema interno |

---

## 🔄 Flujo de Autenticación Completo

### **Paso 1: Registro**

```
┌─────────────────────────────────────┐
│   Usuario nuevo                     │
├─────────────────────────────────────┤
│  POST /api/alumno/registrar         │
│  {                                  │
│    "email": "usuario@email.com",    │
│    "password": "Password123!"       │
│  }                                  │
└─────────────┬───────────────────────┘
			  │
			  ▼
┌─────────────────────────────────────┐
│  RegistrarAlumno.Ejecutar()         │
│  • Valida datos                     │
│  • Verifica email único             │
│  • Hashea password                  │
│  • Crea usuario en BD               │
│  • Retorna usuario creado           │
└─────────────┬───────────────────────┘
			  │
			  ▼
┌─────────────────────────────────────┐
│  201 Created                        │
│  Cuenta creada exitosamente         │
└─────────────────────────────────────┘
```

### **Paso 2: Login**

```
┌─────────────────────────────────────┐
│   Usuario con credenciales          │
├─────────────────────────────────────┤
│  POST /api/auth/login               │
│  {                                  │
│    "email": "usuario@email.com",    │
│    "password": "Password123!"       │
│  }                                  │
└─────────────┬───────────────────────┘
			  │
			  ▼
┌─────────────────────────────────────┐
│  LoginUsuario.Ejecutar()            │
│  • Busca usuario por email          │
│  • Verifica password (hash)         │
│  • Valida estado (ACTIVO)           │
└─────────────┬───────────────────────┘
			  │
			  ▼
┌─────────────────────────────────────┐
│  JwtGenerator.GenerateToken()       │
│  • Genera token JWT                 │
│  • Incluye: id, rol, nombre         │
│  • Expiracion: configurable         │
└─────────────┬───────────────────────┘
			  │
			  ▼
┌─────────────────────────────────────┐
│  200 OK                             │
│  {                                  │
│    "usuario": {...},                │
│    "token": "eyJ..."                │
│  }                                  │
└─────────────────────────────────────┘
```

### **Paso 3: Usar Token**

```
┌─────────────────────────────────────┐
│   Usuario autenticado               │
├─────────────────────────────────────┤
│  GET /api/grupo                     │
│  Authorization:                     │
│  Bearer eyJ...                      │
└─────────────┬───────────────────────┘
			  │
			  ▼
┌─────────────────────────────────────┐
│  [Authorize] Middleware             │
│  • Valida token JWT                 │
│  • Extrae usuario ID                │
│  • Verifica roles                   │
└─────────────┬───────────────────────┘
			  │
			  ▼
┌─────────────────────────────────────┐
│  Endpoint protegido accesible       │
│  200 OK + Datos solicitados         │
└─────────────────────────────────────┘
```

### **Paso 4: Logout**

```
┌─────────────────────────────────────┐
│   Usuario quiere cerrar sesión      │
├─────────────────────────────────────┤
│  POST /api/auth/logout              │
│  Authorization: Bearer eyJ...       │
└─────────────┬───────────────────────┘
			  │
			  ▼
┌─────────────────────────────────────┐
│  LogoutUsuario.Ejecutar(token)      │
│  • Extrae token del header          │
│  • Agrega token a lista negra       │
│  • Invalida sesión                  │
└─────────────┬───────────────────────┘
			  │
			  ▼
┌─────────────────────────────────────┐
│  200 OK                             │
│  "Sesión cerrada correctamente"     │
└─────────────────────────────────────┘
```

---

## 📦 DTOs y Modelos

### **RegistrarAlumnoRequest**

```csharp
public class RegistrarAlumnoRequest
{
	public string Nombre { get; set; }
	public string Apellido { get; set; }
	public string Email { get; set; }
	public string Password { get; set; }
	public string Telefono { get; set; }
}
```

### **RegistrarAlumnoResponse**

```csharp
public class RegistrarAlumnoResponse
{
	public int UsuarioId { get; set; }
	public string Nombre { get; set; }
	public string Apellido { get; set; }
	public string Email { get; set; }
	public string Telefono { get; set; }
	public string Estado { get; set; }  // "ACTIVO"
	public string Rol { get; set; }     // "Alumno"
}
```

### **LoginRequest**

```csharp
public class LoginRequest
{
	public string Email { get; set; }
	public string Password { get; set; }
}
```

### **DtoDatosUsuario** (en respuesta de login)

```csharp
public class DtoDatosUsuario
{
	public int UsuarioId { get; set; }
	public string Nombre { get; set; }
	public string Apellido { get; set; }
	public string Email { get; set; }
	public string Rol { get; set; }
	public string Estado { get; set; }
}
```

---

## 📊 Códigos de Estado HTTP

### **Registro (POST /api/alumno/registrar)**

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| `201` | Created | Alumno registrado exitosamente |
| `400` | Bad Request | Datos inválidos |
| `409` | Conflict | Email ya registrado |
| `500` | Internal Server Error | Error del servidor |

### **Login (POST /api/auth/login)**

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| `200` | OK | Autenticación exitosa, token generado |
| `400` | Bad Request | Email o password no enviados |
| `401` | Unauthorized | Credenciales incorrectas |
| `500` | Internal Server Error | Error del servidor |

### **Logout (POST /api/auth/logout)**

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| `200` | OK | Sesión cerrada correctamente |
| `400` | Bad Request | Token no válido |
| `401` | Unauthorized | No está autenticado |
| `500` | Internal Server Error | Error del servidor |

---

## 💡 Ejemplos Prácticos

### **Ejemplo 1: Flujo Completo (Postman/Curl)**

#### **Paso 1: Registrar nuevo alumno**

```bash
curl -X POST http://localhost:5000/api/alumno/registrar \
  -H "Content-Type: application/json" \
  -d '{
	"nombre": "Carlos",
	"apellido": "García",
	"email": "carlos.garcia@example.com",
	"password": "MiPassword123!",
	"telefono": "+598987654321"
  }'
```

**Respuesta:**
```json
{
  "usuarioId": 2,
  "nombre": "Carlos",
  "apellido": "García",
  "email": "carlos.garcia@example.com",
  "telefono": "+598987654321",
  "estado": "ACTIVO",
  "rol": "Alumno"
}
```

#### **Paso 2: Login**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
	"email": "carlos.garcia@example.com",
	"password": "MiPassword123!"
  }'
```

**Respuesta:**
```json
{
  "usuario": {
	"usuarioId": 2,
	"nombre": "Carlos",
	"apellido": "García",
	"email": "carlos.garcia@example.com",
	"rol": "Alumno",
	"estado": "ACTIVO"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **Paso 3: Usar token para acceder a endpoint protegido**

```bash
curl -X GET http://localhost:5000/api/grupo \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **Paso 4: Logout**

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "mensaje": "Sesión cerrada correctamente"
}
```

---

### **Ejemplo 2: JavaScript/Fetch API**

#### **Registrar Alumno**

```javascript
async function registrar() {
  const response = await fetch('http://localhost:5000/api/alumno/registrar', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
	  nombre: 'María',
	  apellido: 'López',
	  email: 'maria.lopez@example.com',
	  password: 'Segura123!',
	  telefono: '+598912345678'
	})
  });

  const data = await response.json();
  console.log('Usuario registrado:', data);
  return data;
}
```

#### **Login**

```javascript
async function login(email, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
	  email: email,
	  password: password
	})
  });

  const data = await response.json();

  if (response.ok) {
	// Guardar token en localStorage
	localStorage.setItem('token', data.token);
	console.log('Autenticado:', data.usuario);
	return data;
  } else {
	console.error('Error de login:', data);
  }
}
```

#### **Usar Token en Requests**

```javascript
async function obtenerGrupos() {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:5000/api/grupo', {
	method: 'GET',
	headers: {
	  'Authorization': `Bearer ${token}`
	}
  });

  const data = await response.json();
  return data;
}
```

#### **Logout**

```javascript
async function logout() {
  const token = localStorage.getItem('token');

  await fetch('http://localhost:5000/api/auth/logout', {
	method: 'POST',
	headers: {
	  'Authorization': `Bearer ${token}`
	}
  });

  // Limpiar token
  localStorage.removeItem('token');
  console.log('Sesión cerrada');
}
```

---

### **Ejemplo 3: TypeScript/Angular**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  registrar(alumno: any) {
	return this.http.post(`${this.apiUrl}/alumno/registrar`, alumno);
  }

  login(email: string, password: string) {
	return this.http.post(`${this.apiUrl}/auth/login`, {
	  email,
	  password
	});
  }

  logout() {
	return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  obtenerToken() {
	return localStorage.getItem('token');
  }

  guardarToken(token: string) {
	localStorage.setItem('token', token);
  }

  estaAutenticado(): boolean {
	return !!this.obtenerToken();
  }
}
```

---

## 🔒 Seguridad

### **Hashing de Contraseña**

Las contraseñas se hashean usando **BCrypt**:
- ✅ No se almacenan en texto plano
- ✅ Salto aleatorio para cada password
- ✅ Imposible revertir el hash

```csharp
// En RegistrarAlumno
var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
// En LoginUsuario
bool esValido = BCrypt.Net.BCrypt.Verify(request.Password, usuarioEnBD.Password);
```

### **JWT Token**

Estructura del JWT generado:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  // Header
.
eyJzdWIiOiIxIiwibmFtZSI6IkpvZSIsImlhdCI6MTUxNjIzOTAyMn0  // Payload (usuario, rol, exp)
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  // Signature (HMAC)
```

**Incluye:**
- UsuarioId
- Nombre
- Rol
- Email
- Fecha de expiración

### **Lista Negra de Tokens**

Al hacer logout:
- Token se agrega a una lista negra
- Tokens en lista negra no se pueden usar
- Se limpian periódicamente según expiración

---

## 📁 Ubicación de Archivos

### **Controllers**
```
BackEndJoki/Controllers/
├─ AuthController.cs           ← Login, Logout
└─ AlumnoController.cs         ← Registro de Alumno
```

### **Casos de Uso**
```
Joki.LogicaAplicacion/CasosDeUso/
├─ Autenticacion/
│  ├─ LoginUsuario.cs
│  └─ LogoutUsuario.cs
└─ Alumno/
   └─ RegistrarAlumno.cs
```

### **Interfaces**
```
Joki.CasoUsoCompartida/InterfacesCasosUso/
├─ Autenticacion/
│  ├─ ILoginUsuario.cs
│  └─ ILogoutUsuario.cs
└─ Alumno/
   └─ IRegistrarAlumno.cs
```

### **DTOs**
```
Joki.CasoUsoCompartida/DTOs/
├─ Autenticacion/
│  └─ LoginRequest.cs
├─ Usuario/
│  └─ DtoDatosUsuario.cs
└─ Alumno/
   ├─ RegistrarAlumnoRequest.cs
   └─ RegistrarAlumnoResponse.cs
```

---

## 🔍 Flujo Técnico Detallado

### **Registro de Alumno**

```
Request: POST /api/alumno/registrar
	↓
AlumnoController.Registrar()
	↓
IRegistrarAlumno.Ejecutar()
	├─ Valida que email no sea null/vacío
	├─ Valida que password sea segura
	├─ Verifica si email ya existe
	│  └─ Si existe → UsuarioRepetidoException (409)
	├─ Hashea password con BCrypt
	├─ Crea entidad Usuario con rol "Alumno"
	├─ Asigna Estado = "ACTIVO"
	├─ Guarda en BD
	└─ Retorna RegistrarAlumnoResponse
	↓
StatusCode 201 + RegistrarAlumnoResponse
```

### **Login**

```
Request: POST /api/auth/login {email, password}
	↓
AuthController.Login()
	↓
Valida que email y password no sean null
	↓
ILoginUsuario.Ejecutar()
	├─ Busca usuario por email
	│  └─ Si no existe → TokenInvalidoException (401)
	├─ Verifica password con BCrypt
	│  └─ Si no coincide → TokenInvalidoException (401)
	├─ Verifica que usuario esté ACTIVO
	│  └─ Si no está activo → Excepción (401)
	└─ Retorna DtoDatosUsuario
	↓
IJwtGenerator.GenerateToken()
	├─ Crea payload con usuario
	├─ Firma con clave secreta
	├─ Añade expiración (ej: 24 horas)
	└─ Retorna token string
	↓
StatusCode 200 + {usuario, token}
```

---

## ⚡ Ventajas del Sistema

✅ **Stateless:** Token JWT no requiere sesión en servidor  
✅ **Seguro:** Contraseñas hasheadas, tokens firmados  
✅ **Escalable:** Token válido en múltiples servidores  
✅ **Revocable:** Lista negra para logout  
✅ **Rol-based:** Control de acceso por roles (Admin, Alumno, Entrenador)  

---

## 🐛 Posibles Errores y Soluciones

### **Error: "El email ya está registrado"**
- Causa: Email ya existe en BD
- Solución: Usar otro email o hacer login si ya tienes cuenta

### **Error: "Credenciales incorrectas"**
- Causa: Email no existe o password incorrecto
- Solución: Verificar email y password, registrarse si es nuevo

### **Error: "No autenticado" (401)**
- Causa: Token faltante, expirado o inválido
- Solución: Hacer login nuevamente

### **Error: "Acceso denegado" (403)**
- Causa: Usuario no tiene rol requerido
- Solución: Cambiar rol o usar usuario apropiado

---

## 📞 Endpoints Resumen

| Método | URL | Autenticación | Descripción |
|--------|-----|---------------|-------------|
| `POST` | `/api/alumno/registrar` | ❌ | Registrar nuevo alumno |
| `POST` | `/api/auth/login` | ❌ | Obtener token JWT |
| `POST` | `/api/auth/logout` | ✅ | Cerrar sesión |
| `GET` | `/api/alumno` | ✅ Admin | Listar alumnos |
| `GET` | `/api/alumno/{id}` | ❌ | Obtener alumno por ID |
| `DELETE` | `/api/alumno/{id}` | ✅ Admin | Dar de baja alumno |

---

**Versión:** 1.0  
**Última actualización:** 2024  
**Rama:** feature/Pantalla-Registro-De-Usuario
