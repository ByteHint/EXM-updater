const app = require('./app');
const config = require('./config');

const HOST = config.host || 'localhost';
const PORT = config.port || 5000;

console.log('🚀 Starting EDA2 Backend Server...');

const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${server.address().port}`);
  console.log(
    `🌐 API endpoint: http://${HOST}:${server.address().port}/api/v1`
  );
  console.log('📡 Ready to accept requests!');
});
