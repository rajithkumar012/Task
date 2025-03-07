Task Manager Application (React + Django + PostgreSQL + Docker + LLM Integration)
📌 Overview
This is a full-stack Task Management Application that allows users to register, log in, and manage their tasks. The backend is built using Django (Django REST Framework), the frontend is developed using React.js, and PostgreSQL is used as the database.
Additionally, the project integrates an LLM (Large Language Model) API to provide intelligent task descriptions, summaries, or priority suggestions.
The application is fully Dockerized for easy deployment.

📌 Features
✔️ User Authentication (Signup, Login, JWT-based Authentication)
✔️ Task Management (Create, Read, Update, Delete Tasks)
✔️ Search Functionality (Search tasks by title or status)
✔️ LLM Integration (Generate Task Descriptions using AI)
✔️ Dockerization (Fully containerized using docker-compose)

📌 Tech Stack
Component	Technology Used
Frontend	React.js, Tailwind CSS, Axios
Backend	Django, Django REST Framework (DRF)
Database	PostgreSQL
Authentication	JWT (JSON Web Token)
LLM Integration	OpenAI API (GPT) or Hugging Face
Containerization	Docker, Docker Compose

📌 Project Setup (Local Development)
1️⃣ Clone the Repository
git clone https://github.com/your-username/task-manager.git
cd task-manager
2️⃣ Backend Setup (Django)
🔹 Install Dependencies
cd backend
python -m venv venv
source venv/bin/activate   # MacOS/Linux: source venv/bin/activate | Windows: venv\Scripts\activate


🔹 Configure Environment Variables (.env)
Create a .env file inside backend/ and add:
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgres://postgres:password@localhost:5432/task_db
OPENAI_API_KEY=your-api-key  # Required for LLM Integration
🔹 Apply Migrations & Run Server
python manage.py migrate
python manage.py createsuperuser  # Create an admin user
python manage.py runserver
📌 Backend is now running at: http://127.0.0.1:8000/

3️⃣ Frontend Setup (React)
🔹 Install Dependencies
cd frontend
npm install
🔹 Configure .env File for Frontend
Create a .env file inside frontend/ and add:

REACT_APP_BACKEND_URL=http://127.0.0.1:8000
REACT_APP_OPENAI_API_KEY=your-api-key

🔹 Start the React App
npm start
📌 Frontend is now running at: http://localhost:3000/

📌 Docker Setup (For Deployment)
1️⃣ Build & Start the Containers
Navigate to the project root and run:

docker-compose up --build
This will:

Set up a PostgreSQL database
Start the Django backend
Start the React frontend
📌 Access the Application at:

Frontend: http://localhost:3000/
Backend API: http://localhost:8000/


📌 API Endpoints (Backend)
Endpoint	       Method	Description
/api/auth/register/	POST	Register a new user
/api/auth/login/	POST	Login user & get JWT token
/api/tasks/       	GET  	Get all tasks
/api/tasks/     	POST	Create a new task
/api/tasks/<id>/	PUT	Update a task
/api/tasks/<id>/	DELETE	Delete a task
/api/tasks/search/?q=<query>	GET	Search tasks by title
/api/tasks/generate-description/	POST	Generate task description using LLM
