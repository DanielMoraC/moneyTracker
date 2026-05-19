# Documentación API

---

## Usuarios

#### `GET {{api}}/users`

Devuelve todos los usuarios de la base de datos

Response:

```json
[
    {
        "_id": string,
        "password": string,
        "userName": string,
        "name": string
    }
]
```

#### `POST {{api}}/users`

Crea usuario en la base de datos

Body:

```json
{
    "userName": string,
    "password": string,
    "name": string
}
```

Response:

```json
{
    "_id": string,
    "userName": string,
    "name": string
}
```

#### `GET {{api}}/users/{id}`

Devuelve los datos del usuario por id

Response:

```json
{
    "_id": string,
    "userName": string,
    "name": string
}
```

#### `DELETE {{api}}/users/{id}`

Elimina el usuario por id

Necesita acces-token

Response:

```json
{
  "success": true
}
```

#### `POST {{api}}/login`

Hace login del usuario

Body:

```json
{
    "userName": string,
    "password": string
}
```

Response:

```json
{
    "_id": string,
    "userName": string,
    "name": string,
    "token": string
}
```

#### `POST {{api}}/register`

Registra el usuario

Body:

```json
{
    "userName": string,
    "password": string,
    "name": string
}
```

Response:

```json
{
    "_id": string,
    "userName": string,
    "name": string
}
```

---

## Cuentas

#### `GET {{api}}/accounts`

Devuelve todas las cuentas de la base de datos

Response:

```json
[
    {
        "_id": string,
        "name": string,
        "amount": {
            "$numberDecimal": string
        },
        "color": string,
        "idUsers": [string]
    }
]
```

#### `GET {{api}}/accounts/{id}`

Devuelve la cuenta según id

Response:

```json
{
    "_id": string,
    "name": string,
    "amount": string,
    "color": string,
    "idUsers": [string]
 }
```

#### `GET {{api}}/accounts?user={id}`

Devuelve la cuenta según id del usuario

Response:

```json
[
    {
        "_id": string,
        "name": string,
        "amount": string,
        "color": string,
        "idUsers": [string]
    }
]
```

#### `POST {{api}}/accounts`

Crea una cuenta para el usuario

Necesita access-token

Body:

```json
{
    "name": string,
    "amount": string,
    "color": string,
    "idUsers": [string]
}
```

Response:

```json
{
  "success": boolean,
  "_id": string
}
```
