Room Challenge
==============

The Room Challenge App consists of 2 docker containers, the **PostgreSQL DB** container, and the NodeJS **Video Server**.

Video Server Specs
--------------------

Engine: NodeJS
API Framework: Express
Language: Typescript
Container Orchestrator: Docker Compose
Runtime Modes: Dev (via Nodemon) and Production
ORM Library: Sequelize
Authentication Library: Passport + Passport Local

APIs (v1)
----

**AUTHENTICATION**

**POST /v1/register**
```
type=json

username: string, unique
password: string (hashed when storing)
mobileToken: string, optional
```

**POST /v1/login**
```
type=json

username: string, unique
password: string
```

**POST /v1/logout**
```
type=json

username: string, unique
password: string
```

**USERS**

**GET /v1/users**

```
Retrieves all users (information is sanitized)
```

**GET /v1/users/unsanitized**

```
Retrieves all users information in the db
```

**GET /v1/users/username/:username**

```
Retrieves sanitized user given the username
```

**GET /v1/users/username/:username/unsanitized**

```
Retrieves raw user information given the username
```

**GET /v1/users/username/:username/rooms**

```
Retrieves all rooms a user is inside of given a username
```

**PATCH /v1/users/username/:username**

```
Auth Required, Limited to Logged In user

password: string, optional (will be hashed)
mobileToken: string, optional
```

**DELETE /v1/users/username/:username**

```
Auth Required, Limited to Logged In user

Closes the user's account by adding DateRemoved in the DB. Prevents the account from making API calls that require auth.
```

**ROOMS**

**GET /v1/rooms**

```
Retrieves all rooms
```

**GET /v1/rooms/host/username/:username**

```
Retrieves all rooms where in the host is the provided username
```

**GET /v1/rooms/guid/:guid**

```
Retrieves room information given the guid. Contains the participants of the room.

GUID used is UUIDV4.
```

**POST /v1/rooms**

```
Creates a room with the Logged In user as the host.

name: string
capacity: optional int, default=5
```

**POST /v1/rooms/join/:guid**

```
Joins a room as a logged in user. Will throw an error if:

a) User is inside the room already
b) The room is at max capacity
```

**POST /v1/rooms/leave/:guid**

```
Leaves a room as a logged in user. Will throw an error if:

a) User is not inside the room
```

**PATCH /v1/rooms/guid/:guid/host/:username**

```
Auth Required, Limited to rooms that the logged in user is the host of.

Changes the host of the provided room to the new user.
```
