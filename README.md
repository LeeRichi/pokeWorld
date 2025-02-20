# Full Stack Pokémon App

This project is a full-stack Pokémon application built with a Node.js backend, PostgreSQL database, and Docker for containerization. It includes an API to manage Pokémon data and user interactions, and uses Adminer for database management.

Frontend URL: https://pokeworld-leerichis-projects.vercel.app <br>
At this moment we need to use docker to build up our backend and database.

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

## Getting Started

Follow these steps to get your development environment set up:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pokeWorld.git
cd pokeWorld
```

### 2. Set Up Backend Environment

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
	- Start a PostgreSQL database on port 5433.
	- Set up Adminer for database management on port 8080.

### 4. Access the Application

- The Node.js API will be running at: http://localhost:3006
- Adminer (for database management) will be available at: http://localhost:8080

### 5. To Run Frontend Environment Locally (optional)

```bash
cd ../frontend
touch .env
```
copy this to your local .env
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_OFFICIAL_URL=https://pokeapi.co/api/v2/pokemon
FRONTEND_PORT=3000
NEXT_PUBLIC_MY_FRONTEND_API_URL=http://localhost:3000
BACKEND_PORT=3006
NEXT_PUBLIC_MY_BACKEND_API_URL=http://localhost:3006
```
#### Setting Up Google OAuth
To test Google Sign-In(optional), create your own OAuth credentials:

1. Go to [Google Developer Console](https://console.cloud.google.com/).
2. Create a new project and enable **Google OAuth**.
3. Add `http://localhost:3000/api/auth/callback/google` as an **authorized redirect URI**.
4. Copy your **Client ID** and **Client Secret**.
5. modify "GOOGLE_CLIENT_ID" and "GOOGLE_CLIENT_SECRET" in `.env.local`.

```bash
npm install
npm run dev
```
#### Access frotend Application

- Next.js frontend web page can be access in http://localhost:3000/

## Next Steps

- Finalize cloud deployment for backend.
