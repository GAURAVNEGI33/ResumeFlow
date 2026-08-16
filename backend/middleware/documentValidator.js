/**
 * Validate id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function validate(req, res, next) {
  const params = req.params;

  if (!params.id) {
    return res.status(403).send({
      success: false,
      message: "Id not provided.",
    });
  }

  next();
}

module.exports = validate;
