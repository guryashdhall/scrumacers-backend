[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Npm package version](https://badgen.net/npm/v/@babel/core)](https://npmjs.com/package/express)
[![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)](https://www.heroku.com/)


# CSCI 5308 : Final Project (Winter 2022)

- Date Created: 04 Apr 2022
- Last Modification Date: 04 Apr 2022
- Git URL : Backend - https://git.cs.dal.ca/courses/2022-winter/csci-5308/group7/-/tree/development
- Git URL : Frontend - https://git.cs.dal.ca/golani/group7-frontend/-/tree/development 
- Heroku URL: https://scrum-acers-frontend.herokuapp.com/
- Authors:

  [Sukaran Golani](sk300480@dal.ca)
  [Aditya Dixit](ad433393@dal.ca)
  [Guryash Dhall](guryash.dhall@dal.ca)
  [Farhin Damania](fr454807@dal.ca)
  [Parvish Gajjar](pr222321@dal.ca)

<img src="https://drive.google.com/uc?export=view&id=1Q5BEq3ljfwrO3wc58VLI3zFOO0b56OCT" alt="Logo" width="700" height="400"  style="vertical-align:middle"/>

 &nbsp;
 # Scrum Acers

 Scrum Acers is a platform that is developed to increase the development productivity by making the scrum time more productive by letting the peers know about the updates and blockers beforehand. Also, this platform is developed to avoid unnecessary long calls/meetings so that team members can focus more on getting the work done.

### This repository contains the backend and frontend code for the project of "Scrum Acers". To get started with this repository, follow the following steps:
<br>

### 1. Open terminal (Git cmd or new terminal in visual studio code) in your local machine
### 2. In terminal, reach to destinatin(using cd route_to_the_location) where you want to clone the repo(for example, On desktop)
### 3. Clone the repository using following command
       ../Desktop> git clone git@git.cs.dal.ca:courses/2022-winter/csci-5308/group7.git
<br>

### To run the Backend Server,

### 1. Make sure you have cloned the repo, go inside the directory
       ../Desktop> cd group7/scrum_acers_backend
### 2. Create your .env file to store DB Connection information and other private api keys or directly add your db information in index.js file (Not suggested unless testing on local machine)
### 3. Thereafter, run following commands
       ../Desktop/group7/scrum_acers_backend> npm install
       ../Desktop/group7/scrum_acers_backend> node index.js
       
Voila! Your backend application is now live on your localhost :tada:

# Dependencies
 
## Backend

- bcrypt: 5.0.1
- chai: 4.3.6
- chai-http: 4.3.0
- cors: 2.8.5
- express: 4.17.2
- jsonwebtoken: 8.5.1
- lodash: 4.17.21
- mocha: 9.2.0
- nodemon: 2.0.15
- promise-mysql: 5.1.0
- supertest: 6.2.2

## Frontend

- "@material-ui/core": "^4.12.3",
- "@material-ui/icons": "^4.11.2",
- "@mui/icons-material": "^5.4.2",
- "@mui/lab": "^5.0.0-alpha.70",
- "@mui/material": "^5.4.2",
- "@mui/styles": "^5.5.3",
- "@testing-library/jest-dom": "^5.16.2",
- "@testing-library/react": "^12.1.3",
- "@testing-library/user-event": "^13.5.0",
- "axios": "^0.26.1",
- "bootstrap": "^5.1.3",
- "burger-menu": "^1.0.12",
- "date-fns": "^2.28.0",
- "react": "^17.0.2",
- "react-bootstrap": "^2.2.1",
- "react-dom": "^17.0.2",
- "react-jwt": "^1.1.4",
- "react-loader-overlay": "^1.0.0",
- "react-redux": "^7.2.6",
- "react-router": "^6.2.1",
- "react-router-dom": "^5.3.0",
- "react-scripts": "5.0.0",
- "react-toastify": "^8.2.0",
- "redux": "^4.1.2",
- "secure-ls": "^1.2.6",
- "serve": "^13.0.2",
- "sweetalert2": "^11.4.8",
- "web-vitals": "^2.1.4"


# Built With

- [React](https://reactjs.org/) - Front-end JavaScript library.
- [Node.js](https://nodejs.org/en/) - Back-end JavaScript runtime environment
- [Express.js](https://expressjs.com/) - Back end web application framework for Node.js
- [MySQl](https://www.mysql.com/) - SQL database
- [VisualStudio](https://visualstudio.microsoft.com/) - The Code editor used
- [Heroku](https://www.heroku.com/) - The deployment platform
- [Postman](https://www.postman.com/) - The API platform
- [Sonarcloud](https://sonarcloud.io/) - The testing environment to detect code smells
