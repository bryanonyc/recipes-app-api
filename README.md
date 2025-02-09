# Recipe Finder

Recipe Finder is a project I created to search recipes that users have submitted. You can access the app as a guest or as a registered user. Registered users can view, submit, and favorite recipes. Administorators can review recipes submitted by users and approve the recipe for publishing. They can also manage users.

The project is divided into two main components: Backend and Frontend.

You can access the app [here.](https://bryano-recipe-finder.onrender.com/)

Scroll down for instructions on how to run locally.

## Features

-   **Backend**: A Node.js applicaiton that exposes an API endpoint to serve the data to the Frontend. Also leverages Express and Prisma to query the database.
-   **Database**: A Postgres database.
-   **Frontend**: A React application leveraing React, Redux Toolkit, and Ant Design.

## Screenshots

<img width="1503" alt="Screenshot 2025-01-23 at 3 09 42 PM" src="https://github.com/user-attachments/assets/5f0b94e3-9fbb-40c9-8057-996c8e28e977" />

<img width="1502" alt="Screenshot 2025-01-23 at 3 08 53 PM" src="https://github.com/user-attachments/assets/cd94c0d3-078f-46a2-8950-73783ac12f9b" />

<img width="1507" alt="Screenshot 2025-01-23 at 3 09 21 PM" src="https://github.com/user-attachments/assets/f8530cbf-27fa-45ce-81d3-a722b1e5b1b5" />

## Local Environment Setup

### Create JWT Secret Keys

Create two secret keys for the access token and refresh tokens. Follow the steps below and copy values into environment variables.

Open terminal and type `node` and then type: `require(‘crypto’).randomBytes(64).toString(‘hex’)`

Copy the generated value and put into the `ACCESS_TOKEN_SECRET` environemnt variable.

Repeat above steps to generate a new token and put that value into `REFRESH_TOKEN_SECRET` environment variable

### Create Hidden Environment File

Create a `.env` file in the project root with the following environment variables:

-   `NODE_ENV=development`
-   `DATABASE_URL=[YOUR_DB_URL]`
-   `ACCESS_TOKEN_SECRET=[GENERATE_SECRET]`
-   `REFRESH_TOKEN_SECRET=[GENERATE_SECRET]`
-   `ACCESS_TOKEN_EXPIRES_IN="15m"`
-   `REFRESH_TOKEN_EXPIRES_IN="60m"`

Feel free to change the values for the token expiration.

### Start The Servver

Open a terminal and type: `npm run dev`
