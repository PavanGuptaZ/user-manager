## Manager in sideBar has controls
create role in roles page and assign role in user page 

as of now everyone can create and change anyone role but in future only a superadmin can view manager

## Technologies Used:
### Frontend
- HTML
- CSS
- JavaScript
- React.js
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB for database
- Bcrypt for password hashing
- Jsonwebtoken for generating ACCESS_TOKEN and REFRESH_TOKEN

## Installation:
Clone the repository to your local machine:
```bash
git clone https://github.com/PavanGuptaZ/user-manager.git
```

### Setup Environment keys
Create .env files in both the frontend and backend folders:
#### In the Backend folder add the following variables
-	DATABASE_URL (MongoDB connection string)
-	PORT : 3500 (use this only)
-	ACCESS_TOKEN : secret key
-	REFRESH_TOKEN : secret key

add Frontend origin in - backend/config/allowed origin.js

````JavaScript
const allowedOrigins = [
    'http://localhost:5173',
    'http://192.168.0.107:5173'
    'ADD REQUIRE ORIGINS'
]

export default allowedOrigins
````

it is going to help on CORS

### ToRun
Navigate to the frontend and backend folders in the terminal and run

#### for frontend
````bash
  cd frontend
  npm install
  npm run start
````

#### for backend
````bash
  cd backend
  npm install
  npm run dev
````

Check DATABASEURL and VITE_BACKEND_LINK in the respective .env files and update if necessary.
