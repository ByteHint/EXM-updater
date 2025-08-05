module.exports.getStatus = async (req, res) => {
  res.status(200).json({
    healthy: true,
    uptime: process.uptime(), // in seconds
    timestamp: Date.now(),
    version: '2.0.0',
  });
};
