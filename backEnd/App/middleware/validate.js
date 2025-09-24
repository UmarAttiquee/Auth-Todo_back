// validate.js
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false }); // saari errors dekhne ke liye
    next(); // sab sahi hai, agay jao
  } catch (error) {
    // Error list banani
    const errors = error.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }
};

module.exports = validate;
