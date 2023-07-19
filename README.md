
## Description

A full-stack Twitter clone app built using Node.js, Express.js, React.js, and MongoDB.

### Background

The project was created to test the the experience level Selenium

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have a running MongoDB instance.

## Installing MongoDB

you must have an intance of MongoDB running on you computer to run the application. 

Please follow the steps below to install the MongoDB Community Edition (If you need to install Install Xcode Command-Line Tools it could take up to 20 minutes)

https://www.mongodb.com/docs/manual/administration/install-community/


### Configuration

Copy the `server/.env.example` file to `server/.env` and update the values if your configuration is different than the default.

### Installing

Install server dependencies

```bash
$ cd server
$ npm install
```

Install client dependencies

```bash
$ cd client
$ npm install
```

### Start MongoDB instance

`brew services start mongodb-community@6.0`

### Start the server in development mode

```bash
$ cd server
$ npm run dev
```

### If you run into dependency errors 

`use npm audit fix'

If everything was successful, you should see the messages being displayed in the terminal, telling that the server has successfully connected to a MongoDB and runs on a given port.

### Start the client

```bash
$ cd client
$ npm start
```

Now, the app should be running on `http://localhost:3000`.

