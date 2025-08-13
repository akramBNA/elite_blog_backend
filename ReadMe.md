# ELITE BLOG WEB APPLICATION'S BACK-END

* This is the backend file for the elite blog web application. It is connected to a **MongoDB** database and provides REST APIs for the frontend.

---

## Installation & Setup

1. Set up environment variables for:
   - MongoDB connection URI
   - Frontend URL (for CORS and Socket.IO communications)
   
2. Install dependencies:
   ```bash
   npm install

3. Run the server:
  ```bash
   npm start
   ```

## It is mandatory to set up an admin using postman or an api testing tool:

* route (POST) : http://localhost:5000/api/users/addUser (or whatever your port is).

* body :
```bash
    {
    "firstName": "Your_name",
    "lastName": "your_last_name",
    "email": "your_email@mail.com",
    "password": "your_password", // must be at least 6 chars
    "roleType": "Admin"  ---> it is important to signup as admin in the first place to be able to access full features of the app and changes other users roles.
    }
```

## Architecture:

* use of MVC architecture.

* Model -> DAO -> Controllers -> Routes -> server.js

---

## Frontend Repo:

* https://github.com/akramBNA/elite_blog_frontend