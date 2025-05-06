# Todo Application

A full-stack Todo application with React frontend, Express backend, and PostgreSQL database.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL

## Features

- Add new tasks with title and description
- Mark tasks as complete
- View all tasks

## Running the Application

### Prerequisites

- Docker
- Docker Compose

### Steps to Run

1. Clone the repository
2. > 💡 Make sure to install Node.js dependencies for both `backend` and `frontend` folders if you're running the project outside Docker:
> 
> ```bash
> cd backend && npm install
> cd ../frontend && npm install
> ```

3. From the project root directory, run:

```bash
docker compose up --build
```

3. Access the application at http://localhost

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id/complete` - Mark a task as complete
