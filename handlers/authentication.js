'use strict';

const serverless = require("serverless-http");

const Server = require('../models/server');

const server = new Server();

module.exports.handler = serverless(server.app);