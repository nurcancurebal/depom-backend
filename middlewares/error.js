module.exports = function (error, req, res, next) {

    let status = error?.status || 406;
    return res.status(status).send({ message: error.message })
}