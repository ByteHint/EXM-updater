const getGeoip = async (req, res, next) => {
  try {
    const ipInfo = req.ipInfo || {};

    req.requestInfo = {
      userData: {
        ip: ipInfo.ip || req.ip || 'unknown',
        city: ipInfo.city || 'unknown',
        country: ipInfo.country || 'unknown',
        region: ipInfo.region || 'unknown',
      },
      method: req.method,
      originalUrl: req.originalUrl,
    };

    next();
  } catch (error) {
    console.error('getGeoip middleware error:', error.message);
    next(); // don't block the request even if IP info fails
  }
};

module.exports = { getGeoip };
