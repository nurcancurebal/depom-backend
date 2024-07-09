module.exports = function (error, _req, res, _next) {
  let status = error?.status || 406;
  return res.status(status).send({ message: error.message });
};
