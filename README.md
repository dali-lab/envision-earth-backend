# Grazing Earth
Backend for the [Grazing Earth mobile app](https://github.com/dali-lab/grazing-earth-mobile).

## Tech Stack
  - [Express](https://expressjs.com/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [Sequelize](https://sequelize.org/)
  - [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript)
  - [Passport.js](https://www.passportjs.org/)
  - [axios](https://github.com/axios/axios)
  - [TypeScript](https://www.typescriptlang.org/docs/)

## Directory Structure

    .
    ├── ...         
    ├── src                    
    |   └── auth                # JWT middleware
    |   └── controllers         # dispatch input; output
    |   └── db                  # PostgreSQL database definitions
    |     └── config            # define database modes
    |     └── migrations        # Sequelize migrations
    |     └── models            # defines structure of PostgreSQL tables
    |     └── seeders           # code to populate database with initial data
    |   └── errors              # internal error handling
    |   └── routers             # route url endpoint
    |     └── __tests__         # test cases for routers
    |   └── services            # handles database queries and related functionality
    |     └── __tests__         # test cases for services
    |   └── validation          # validates input w/ joi
    |   └── constants.ts        # server constants
    |   └── server.ts           # starting point of server
    └── ...

## Setup

1. clone repo and `npm install`
2. Install PostgreSQL + management tool
  - Make sure to do `npm install --save-dev sequelize-cli` if you don't have the sequelize cli yet.
  - Windows
    - Install [Windows Subsystem for Linux (WSL)](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-10#1-overview)
    - Follow directions [here](https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-database#install-postgresql) to install PostgreSQL on WSL
    - Install [pgAdmin](https://www.pgadmin.org/)
    - Follow directions [here](https://www.vultr.com/docs/install-pgadmin-4-for-postgresql-database-server-on-ubuntu-linux/) to connect pgAdmin to PostgreSQL and WSL
  - MacOS
    - Ensure [Homebrew](https://brew.sh/) is installed
    - Run `brew install postgresql` if PostgreSQL isn't installed
    - If you'd like to use a GUI to interact with PostgreSQL, download one. We recommend [Postico](https://eggerapps.at/postico/)
3. Create a PostgreSQL DB called `grazing_earth` if setting up locally, using your GUI of choice (Postico or pgAdmin).
4. Create a `.env` file in the root directory
  - Should be in the following format:
  - ```
    AUTH_SECRET=*secret assortment of characters used for encryption*
    PORT=4000
    DATABASE_URL=postgres://username:password@localhost:5432/grazing_earth
    AWS_ACCESS_KEY_ID=*see credentials doc*
    AWS_SECRET_ACCESS_KEY=*see credentials doc*
    S3_BUCKET_NAME=*see credentials doc*
    SENDGRID_EMAIL=*see credentials doc*
    SENDGRID_API_KEY=*see credentials doc*
    DEBUG=true
    ```
5. Run `npx sequelize db:migrate` to apply migrations to DB.
6. Run `npx sequelize db:seed:all` to load initial data.
7. App should be ready for use now
  - `npm start` to run in production mode
  - `npm run dev` to run with hot reloading

#### Redux Debugging

Download the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) extension.

#### Linting

ESLint is set up in this project. To keep code clean, always remember to run `npm run lint` and fix any lint problems before merging into master.

#### Unit Testing

Jest unit testing is set up for the controllers, routers, and services. Remember to run `npm test` and fix any breaking changes that might've occured. 
  - You can also run just an individual test file with `npm test -- *filename*`

## Authors & Credits
- Eric Lu '25