const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');
const corsOptions = {
  origin: false,
  credentials: true,
  methods: ['GET', 'PUT', 'POST'],
  optionsSuccessStatus: 200
}

class Server {
  constructor() {
    this.app = express();
    this.paths = {
      authPath: '/api/auth',
      usersPath: '/api/users'
    };
    this.connectDB();
    this.middlewares();
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.authPath, require('../routes/auth'));
    this.app.use(this.paths.usersPath, require('../routes/user'));
  }
}

module.exports = Server;