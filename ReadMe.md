# ELITE BLOG WEB APPLICATION'S BACK-END

* This is the backend file for the elite blog web application. it is connected to MongoDB database.

## Installation & Setup

* set up environments for mongoDb and frontend socket communications
* npm install
* npm start

## It is mandatory to set up an admin using postman or an api testing tool:

* route (POST) : http://localhost:5000/api/users/addUser (or whatever your port is).

* <pre> body: ```json { "firstName": "Your_name", "lastName": "your_last_name", "email": "your_email@mail.com", "password": "your_password", "roleType": "Admin" } ``` </pre>

## Architecture:

* use of MVC architecture.

* Model -> DAO -> Controllers -> Routes -> server.js

## Frontend Repo:

* https://github.com/akramBNA/elite_blog_frontend