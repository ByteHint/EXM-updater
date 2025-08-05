// File: middlewares/inputs.js
const inputs = (schema, property) => {
  return (req, res, next) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (err) {
      res.status(422).json({ error: err.message, status: 422 });
    }
  };
};

module.exports = { inputs };
