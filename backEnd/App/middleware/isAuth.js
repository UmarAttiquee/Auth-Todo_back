const jwt = require("jsonwebtoken");
const UserModal = require("../modal/userModal.js");
const sessionModal = require("../modal/sessionModal");
const SessionModal = require("../modal/sessionModal");
require("dotenv").config();

const isAuth = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    } else if (req.query.token) {
      token = req.query.token; // Use token from query params if no header
    } else {
      return res.status(400).json({
        status: false,
        message: "Herer Token not found",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(400).json({
        status: false,
        message: "token is Invalid",
      });
    }

    const user = await UserModal.findById(decode.id);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User Not Found ",
      });
    }

    if (!user.isLoggin) {
      return res.status(400).json({
        status: false,
        message: "User is not login ",
      });
    }

    const session = await SessionModal.findOne({
      UserID: user._id,
      jti: decode.jti,
    });

    if (!session) {
      return res.status(401).json({
        status: false,
        message: "Session not valid (token is old or logged out)",
      });
    }

    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something wents Wrong",
      error: error.message,
    });
  }
};

module.exports = isAuth;
