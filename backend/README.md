
# PokeWorld - Backend

## Key Features
- 🛡 Authentication & Authorization: Users can register, log in, and authenticate using JWT.
- 📡 REST API Endpoints: Standard endpoints for CRUD operations.
- 📊 GraphQL Support: Alternative query interface for optimized data fetching.
- 🐳 Dockerized Deployment: Runs seamlessly in containerized environments.
- ☁️ AWS EC2 Instance: Deployed the backend on AWS EC2 instance for scalable hosting.

## Folder structure
```
.
├── Dockerfile
├── Procfile
├── docker-compose.yml
├── package.json
└── src
    ├── auth
    │   ├── authMiddleware.js
    │   ├── login.js
    │   ├── register.js
    │   └── userModel.js
    ├── db.js
    ├── graphql
    │   ├── graphql.js
    │   ├── index.js
    │   └── schema.js
    ├── index.js
    ├── pokemon
    │   └── pokemon.js
    └── user
        └── user.js
```

## Backend Setup

- First, we will start from setting up from back-end.
- You will need to create a .env file to configure the database and backend environment variables.

```bash
cd backend
touch .env
```

- Add the following content to the .env file:

```bash
DB_USER=youruser
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pokemon_db
BACKEND_PORT=3006
JWT_SECRET=your_jwt_secret
```

### 3. Build and Run the Docker Containers
- The project uses Docker Compose to build and run the application.
First step is to make sure Docker daemon app is running.
Run the following command to build and start all the containers:

```bash
docker-compose run app sh
npm install
exit
docker-compose up --build
```
- This will:
	- Build the Node.js application and start it on port 3006.
	- Start a PostgreSQL database on port 5432.

### 4. Access the Application

- The Node.js API will be running at: http://localhost:3006
- Adminer (for database management) will be available at: http://localhost:8080

<h2 id="routes">📍 API Endpoints</h2>

### GraphQL Endpoint

- **URL**: `http://localhost:3006/graphql`

```
query Pokemons {
  pokemons(page: 1, limit: 20, sort: "id", order: "asc") {
    total
    pokemons {
      id
      name
      likes
      sprites {
        front_default
      }
      height
      weight
      types {
        slot
        type {
          name
          url
        }
      }
    }
  }
}
```
**RESPONSE**
```
  "data": {
    "pokemons": {
      "total": 1304,
      "pokemons": [
        {
          "id": 1,
          "name": "bulbasaur",
          "likes": 1,
          "sprites": {
            "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
          },
          "height": 7,
          "weight": 69,
          "types": [{...}]
        }
      ]
    }
  ...
}
```

### REST API Endpoints
<h3 id="post-auth-detail">POST /api/login</h3>

**REQUEST**
```json
{
  "username": "rich",
  "password": "1234"
}
```

**RESPONSE**
```json
{
  "token": "OwoMRHsaQwyAgVoc3OXmL1JhMVUYXGGBbCTK0GBgiYitwQwjf0gVoBmkbuyy0pSi",
	"message": "log",
	"user": "user{}",
}
```

<h3 id="post-auth-detail">POST /api/register</h3>

**REQUEST**
```json
{
  "username": "rich",
	"email": "rich@gmail.com",
  "password": "1234"
}
```
**RESPONSE**
```json
{
  "token": "OwoMRHsaQwyAgVoc3OXmL1JhMVUYXGGBbCTK0GBgiYitwQwjf0gVoBmkbuyy0pSi",
	"message": "Login succesful",
	"user": "user{}",
}
```

<h3 id="post-auth-detail">DELETE /api/users/favorites</h3>

**REQUEST**
- **Headers**:
  - `Authorization`: `Bearer <token>` _(Required)_

- **Body** (JSON):
```json
{
  "userId": "3",
	"pokemonId": "3",
}
```
**RESPONSE**
```json
{
	"message": "message: 'Favorite Pokémon removed successfully'",
}
```

<h3 id="post-auth-detail">PUT /api/users/:id/editUserInfo</h3>

**REQUEST**
- **Headers**:
  - `Authorization`: `Bearer <token>` _(Required)_

- **Body** (JSON):
```json
{
  "username": "cat",
	"email": "cat@gmail.com",
	"id": "1"
}
```
**RESPONSE**
```json
{
	"message": "message: 'Favorite Pokémon removed successfully'",
}
```

