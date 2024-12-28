# Uber Backend

This is the backend for the Uber application. It is built using Node.js, Express, and MongoDB.

## Project Structure


## Installation

1. Clone the repository
2. Install dependencies using `npm install`
3. Create a `.env` file in the `uber-backend` directory with the following variables:
    ```
    MONGO_URI=<your_mongo_uri>
    JWT_SECRET=<your_jwt_secret>
    PORT=<your_port>
    ```
4. Start the server using `npm start`

## Endpoints

### Register User

**URL:** `/users/register`

**Method:** `POST`

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}


{
  "token": "<jwt_token>",
  "user": {
    "_id": "<user_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "<hashed_password>",
    "socketId": null
  }
}



Login User
URL: /users/login

Method: POST

Request Body:{
  "email": "john.doe@example.com",
  "password": "password123"
}

{
  "token": "<jwt_token>",
  "user": {
    "_id": "<user_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "<hashed_password>",
    "socketId": null
  }
}

Get Profile
URL: /users/getProfile

Method: GET

Headers:Authorization: Bearer <jwt_token>


Response:
{
  "user": {
    "_id": "<user_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "<hashed_password>",
    "socketId": null
  }
}


Logout User
URL: /users/logout

Method: GET

Headers:Authorization: Bearer <jwt_token>

Response:


{
  "message": "logout successfully"
}