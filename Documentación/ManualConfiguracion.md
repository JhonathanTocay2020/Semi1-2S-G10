# Seminario de Sistemas 1-2S2023
## Grupo 10 

# Proyecto 2 📚
### SemiSocial

### Integrantes 
| Carnet | Nombre |
| --- | --- |
| 201801229	| Osman Alejandro Perez Lopez|
| 201801268 | Jhonathan Daniel Tocay Cotzojay |
| 201807420	| David Roberto Diaz Prado |
| 201900172	| Melani Alejandra López de la Roca |

## Manual de Configuración

# Objetivos
## General
Proporcionar una guía completa que documente la implementación de los servicios tanto de desarrollo como seguridad de AWS en el proyecto SemiSocial, teniendo en cuenta todos los requisitos establecidos.

## Específicos
- Detallar la arquitectura utilizada en SemiSocial, en el que se incluye componentes, diseño y flujos de datos relevantes.

- Presentar un diagrama de modelo entidad-relación utilziado, en el cual se ilustre la estructura de la base de datos utilizada en SemiSocial.

- Proporcionar una descripción completa de cada servicio empleado, asi como los usuarios IAM (Identity and Access Management) utilizados para el desarollo del proyecto permitiendo los distintos roles y políticas.

# Arquitectura del Proyecto
[![Arquitectura.png](https://i.postimg.cc/5yhcGCRp/Arquitectura.png)](https://postimg.cc/64f14ywG)

## Backend
Para el Backend, se creó el servidor en Node.JS utilizando express, morgan y cors para su configuración. Para la conexión a aws se utilizó aws-sdk, para la conexión a la base de datos se utilizó mysql2 y para leer el .env se utilizó dotenv. Para la seguridad se implemento JWT para la verificación de permisos e inicio de sesión enlazada con cognito. Dicho servidor se encuentra alojado en una EC2.


## Frontend
La pagina web se creo utilizando React.JS utilizando VITE para su configuración. y se construyo para ser alojada en la misma instancia EC2 donde se encuentra el backend por medio de una imagen de docker para poder ejecutarlo.


## Base de Datos
La base de datos se implemento utilizando MySQL como gestor y ejecución dentro de un contenedor de docker. 

# Diagrama de la Base de datos:

[![DB.png](https://i.postimg.cc/nz0kWfCL/DB.png)](https://postimg.cc/jwnPW96V)

## Descripción de las Tablas
**Usuario** 
- Almacena los datos de los usuarios.

**Chat**
- Almacena los id de los chat llevados a cabo.

**Amigo**
- Almacena las solicitudes de amistad y donde se tendrá el estado en el que se encuentra los amigos y su chat.

**Publicacion**
- Almacena las publicaciones que un usuario realiza.

**Comentario**
- Almacena los comentarios, el usuario y a que publicacion pertenecen.

**Publicación_Etiqueta y Etiqueta**
- Almacena las distintas etiquetas que encuentra en nuestra publicación la cual servira para los distintos filtros.

**FotoPerfil**
- Almacena los distintos URL de las fotos de perfil asignadas por el usuario.

# Usuario de IAM

[![Usuarios-IAM.jpg](https://i.postimg.cc/G2xXFsk6/Usuarios-IAM.jpg)](https://postimg.cc/8JsdDcXb)

# Configuración de Despliegue y Servicios
* Amazon EC2

    Para el despliege del proyecto se utilizaron dos instancias de EC2. Una de las instancias se utilizó para la base de datos MySQL en uso por medio de docker y la segunda instancia ejecuta el backend y el frontend igualmente por medio docker.

    [![instancias.jpg](https://i.postimg.cc/pXCywVZx/instancias.jpg)](https://postimg.cc/dL7qdYpS)
    
* Amazon S3

    Se creo un bucket en Amazon S3 que contiene donde se almacenan las fotografias de los usuarios.La base de datos almacenaria el url de cada imagen.
    
    [![RK.jpg](https://i.postimg.cc/FKQbTHsv/RK.jpg)](https://postimg.cc/4YBhdZ92)

* Amazon Rekognition

    Para el analisis de las fotos se utilizó este servicio. Se accede por medio de las credenciales o por medio de cámara donde recibe la foto del rostro para iniciar sesión por este medio.

* Amazon Translate

     Se utilizó para traducir a diferentes idiomas las descripciones de las fotos ingresadas a la plataforma. Se accede por medio de las credenciales del usuario.

* Amazon Lex
    
    Se utiliza el chatbot que nos brinda este servicio. Se accede a él y recibe un texto que devuelve una respuesta dependiendo el texto o pregunta que ingresemos. 

    [![LEX.jpg](https://i.postimg.cc/HLVJ4Gbm/LEX.jpg)](https://postimg.cc/mcW2B5dp)

* Amazon Cognito

    Se utiliza para el manejo de credenciales de inicio de sesión. Se encarga de verificar que el correo ingresado a la plataforma sea valido y que al momento de intentar acceder el usuario y la contraseña sean correctos.

    [![cognito.jpg](https://i.postimg.cc/HskT7wwD/cognito.jpg)](https://postimg.cc/MXNCCj3d)

* Lambda

    Es una plataforma que permite ejecutar código de manera escalable y sin preocuparse por la infraestructura subyacente. En este caso fue utilizada para la parte del traslate en el proyecto SemiSocial

    [![lambda.jpg](https://i.postimg.cc/fy4BQfM3/lambda.jpg)](https://postimg.cc/N9411T9Y)

* API Gateway

    Actua como un punto de entrada centralizado para todas las solicitudes de API.

    [![API-Gateway.jpg](https://i.postimg.cc/c4p5NZ49/API-Gateway.jpg)](https://postimg.cc/N5xx13Xm)