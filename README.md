

## Installation

```bash
clonar el proyecto: git clone https://github.com/AlejoFabianV/Blog-back.git
```

```bash
cd <directorio>
npm install
```

## Running the app

ejecucion del server: npm run start:dev
```

## Documentacion en Swagger de la Api y respuesta de cada endpoint

http://localhost:3000/api/docs
```

## AuthService y sus funciones

register(): crea un usuario a partir del dto "RegisterUsertDto" que tiene tres propiedades "username", "password" (estas respectivamente tienen como dato tipo string) y "isAdmin" (recibe como dato un boolean). No se pueden crear dos usuarios con el mismo nombre, para ello hace uns busqueda en la DB para comparar usename. Para la password se utiliza "bcrypt" para hasher la password y no guardarla como texto plano en la DB.

validateUser(): valida que el usuario exista para poder logearlo a traves del dto "LoginUserDto". Compara la password hasheada con "bcrypt.compare()" y verifica si el usuario tiene permios de administrador.

login(): logea al usuario si fue verificado y genera un bearer token para proteger la info del usuario.

## PostService y sus funciones

filterPosts(): se desestructura el dto "FilterPostDto" este contiene title, author, description, category, limit y offset, todos opcionales ya que se accede a ellos a traves de Query params, limit y offset son para el paginado por defecto limit vale 10 y offset 0. Con esta funcion se puede bucar y filtrar por los campos que esta compuesto el dto mencionado.

isOwner(): esta fucnion compara el campo author del schema POST y el campo username del schema USER, si hay coincidencia devuelve true, esto se usara para editrar posteos asi tambien como eliminarlos si hay coincidencia o si se tiene el rol admin, de lo contrario devolvera un false.

getById(): para obtener un posteo especifico por su id.

getAllForAuthor(): obtiene todos los posteos de un autor en especifico.

create(): para crear un posteo nuevo y utiliza el dto "CreatePostDto" que tiene como campos title, author, description y category, siendo este ultimo opcional.

delete(): para eliminar un posteo especifico por su id.

update(): editar un posteo espcifico, utiliza el dto "UpdatePostDto" que tiene como campos title, author, description y category, siendo todos opcionales.


## UserService y sus funciones

getAll(): un listado de todos los usuarios.

getAllAdmins(): un listaado de usuarios administradores, solo es accesible para usuarios con el rol admin.

getById(): obtener un usuario especifico por su id.

delete(): eliminar un usuario especifico por su id.

update(): edita un usuario,  utiliza el dto "UpdateUserDto" que contiene los campos username, password y isAdmin, todos ellos opcionales. En este codigo no hay filtro de roles para editar asi que cualquier user podria editar.

## Decorator

Roles: un decorador para definir roles, en este codigo hay dos tipos de roles "admin" y "owner". El tipo de usuario "owner" es un usuario basico no tiene permitido acceder a rutas administrativas.

## Estrategias

LocalStrategy: se importa la strategy de passport-local ya que el login es con info local y no con un servicio de tercero. Esta clase extiende de PassportStrategy y en el super del constructor se escribe el nombre de la key que se usa para iniciar sesion, en este caso sera "username". Esta estrategia llama al authService si todo esta bien devuelve el usuario.

JwtStrategy: analiza el token y verifica el username y el rol para las solicitudes de ciertas rutas o las opciones de moderacion.
