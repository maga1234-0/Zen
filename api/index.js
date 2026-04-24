// Vercel serverless function that proxies to the Express server
require('ts-node/register');
const app = require('../server/src/server').default;

module.exports = app;
