# Full Stack Pokémon App

This project is a full-stack Pokémon application built with Node.js and Java in the backend, PostgreSQL database, and Docker for containerization. It includes an API to manage Pokémon data and user interactions via both REST API and GraphQL, server-side sorting of large data, and finally deployment to AWS EC2.

## Project demo
updated at Jun 16, 2025
https://pokeworld-leerichi-leerichis-projects.vercel.app/

<img width="1413" alt="front page demo photo" src="https://github.com/user-attachments/assets/50df0eb4-5834-461d-9804-271082eba488">

## Technologies Used
- Frontend: React, Next.js (with TypeScript)
- Backend: Node.js, Express, REST API, GraphQL, Java
- Database: PostgreSQL
- Containerization: Docker
- Deployment: AWS EC2/RDS, Vercel

## Features

- API for Pokémon Data Management: Available in both REST API and GraphQL formats for CRUD operations.
- User Authentication: Secure authentication using JWT, with Google Auth integration powered by Node.js.
- Cart Management: Implemented using Java for managing shopping carts for logged-in users.
- Server-side Sorting and Filtering: Optimized with lazy loading to improve data retrieval efficiency.
- Dockerized Application: Node.js, Java, and PostgreSQL database deployed in three containers and hosted on AWS EC2 for scalability.


## To Run The App Locally (optional)
#### Requirements
- Docker

Follow these steps to get your development environment set up:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pokeWorld.git
cd pokeWorld
```

### 2. Set Up Backend Environment
For more details on the backend setup, check out the [Backend Setup section](backend/README.md#backend-setup).

### 3. Set Up Frontend Environment
For more details on the frontend setup, check out the [Frontend Setup section](frontend/README.md#frontend-setup).
