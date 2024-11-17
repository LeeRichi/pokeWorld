# Full Stack Pokémon App

This project is a full-stack Pokémon application built with a Node.js backend, PostgreSQL database, and Docker for containerization. It includes an API to manage Pokémon data and user interactions, and uses Adminer for database management.

<img width="1413" alt="Screenshot 2024-11-17 at 11 38 53 PM" src="https://github.com/user-attachments/assets/50df0eb4-5834-461d-9804-271082eba488">

## Technologies Used
- Frontend: React, Next.js (with TypeScript)
- Backend: Node.js, Express
- Database: PostgreSQL
- Containerization: Docker

## Features

- API to manage Pokémon data (CRUD operations)
- User authentication (JWT) (google Auth)
- Pokémon favorites functionality

## Requirements

- Docker
- Docker Compose

## Getting Started

Follow these steps to get your development environment set up:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pokeWorld.git
cd pokeWorld
```

### 2. Set Up the Environment

- You will need to create a .env file to configure the database and backend environment variables.

```bash
touch .env
```

- Add the following content to the .env file:

```bash
DB_HOST=db
DB_USER=youruser
DB_PASSWORD=yourpassword
DB_NAME=pokemon_db
BACKEND_PORT=3006
JWT_SECRET=your_jwt_secret
```

### 3. Build and Run the Docker Containers
- The project uses Docker Compose to build and run the application. Run the following command to build and start all the containers:

```bash
docker-compose up --build
```
- This will:
	- Build the Node.js application and start it on port 3006.
	- Start a PostgreSQL database on port 5433.
	- Set up Adminer for database management on port 8080.

### 4. Access the Application

- The Node.js API will be running at: http://localhost:3006
- Adminer (for database management) will be available at: http://localhost:8080
