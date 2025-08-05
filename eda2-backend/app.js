const express = require('express');
const cors = require('cors');
const expressip = require('express-ip');

const app = express();

app.use(express.json());

app.use(expressip().getIpInfoMiddleware);

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Routes
require('./routes')(app);

module.exports = app;
