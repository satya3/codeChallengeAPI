# Testing Express.js API using Mocha & Chai

We will write end-to-end (functional) tests for API endpoints which does CRUD operations in Express. This project uses:
- **[Express.js](https://expressjs.com/)** - Node.js web application framework
- **[Mocha](https://mochajs.org/)** - JavaScript test framework running on Node.js and in the browser
- **[Chai](https://www.chaijs.com/)** - BDD / TDD assertion library for node and the browser that can be used with any javascript testing framework
- **[Supertest](https://www.npmjs.com/package/supertest)** - npm module with a high-level abstraction for HTTP testing
- **[MongoDB](https://www.mongodb.com/)** - document-based, distributed NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling for Node.js
- **[body-parser](https://www.npmjs.com/package/body-parser)** - Node.js HTTP request body parsing middleware
- **[nyc](https://www.npmjs.com/package/nyc)** - command-line-client for Istanbul (JavaScript test coverage tool)

### 1. Initialize the project:
```
npm init
```

### 2. Install the required packages:
```
npm install express mocha chai body-parser mongoose supertest nyc
```

### 3. Update the "main" and "scripts" params in package.json like this:
```
{
  "name": "sathya",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "bat": "pre.bat",
    "cls": "cls || clear",
    "start": "node bin/www",
    "test": "mocha --timeout 11000 --exit",
    "coverage": "npm run bat && nyc --reporter=html --reporter=text npm test"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.19.0",
    "chai": "^4.2.0",
    "express": "^4.17.1",
    "mocha": "^8.1.1",
    "mongoose": "^5.10.0",
    "supertest": "^4.0.2",
    "nyc": "^15.1.0"
  }
}
```
**pre.bat** is a windows batch script that starts the localhost MongoDB server and shell
```shell
@echo off
SET location=%CD%
REM echo %path%
cd "C:\Program Files\MongoDB\Server\4.2\bin"
start call mongod -dbpath c:\data\db
TIMEOUT /T 10
start call mongo
cd %location%
```

Run ```npm bat``` and then in the Mongo shell:

- list your databases: ``` show dbs ```
- create sathya database : ``` use sathya ```  
- create reservations table and insert some data:

``` db.reservations.insert({// reservation obj}) ```
- check if reservations collection is created: ``` show collections ```
- list reservations data: ``` db.reservations.find() ```
- check the current database name, number of collection and documents: 
``` db.stats() ```


The cmd output:

!['mongodb-shell'](img/mongodb-shell.jpg)

Try [MongoDB Compass GUI](https://www.mongodb.com/try/download/compass) if you don't like command line:

!['MongoDB Compass'](img/mongodb-compass-database.jpg)

**bin/www** file creates a httpServer and passes app as the handler (this code could be added in app.js too but it's better to keep it separated):

```shell
#!/usr/bin/env node

let app = require("../app");
let http = require("http");
const config = require('../config');

let port = config.port;
app.set("port", port);

let server = http.createServer(app);
server.listen(port);

server.on("error", (err) => {
  console.error(err);
});

server.on("listening", () => {
  console.log(`Server listening on port ${port}`)
});
```

**#!/usr/bin/env node** in an executable plain-text file on Unix-like platforms, tells the system what interpreter to pass that file to for execution, via the command line following the magic #! prefix (called **shebang**).
Windows does not support **shebang lines**, so this line will be ignored.

Run ```node bin/www``` to start the server on localhost:3000

### 4. Add reservation model, controller, route and test files. The project structure should be like this:
!['express'](img/nodejs-express-mongodb-mocha-chai.jpg)

**app.js**:

```javascript
const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const bodyParser= require('body-parser');
const config = require('./config');
const env = process.env.NODE_ENV || 'development';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.db[env], config.dbParams);

mongoose.connection.on("error", err => {
    console.log("err", err)
});
  
mongoose.connection.on("connected", () => {
  console.log("mongoose is connected...")
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose is disconnected...")
});

const reservationsRouter = require("./routes/reservation.route");

app.use("/api/reservations", reservationsRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
```

**config.js**:

```javascript
module.exports = {
    port: 3000,
    db: {
      production: "mongodb://reservation:pass@example.com:1234/sathya",
      development: "mongodb://localhost/sathya",
      test: "mongodb://localhost:27017/sathya",
    },
    dbParams: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
};
```

**reservation.model.js**:


### 5. Execute Test Coverage:

```shell
npm run coverage
```
