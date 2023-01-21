const jwt = require("jsonwebtoken");
const JWT_SECRET = "Arghyaisagood$boy";

const fetchUser = (req, res, next) => {
  // get the user from the jwt token and add id to req object
  try {
    const token = req.header("auth-token"); // bring userlogin token(not create user token) from header by setting the name as key of 'auth-token' in header object & value is userlogin token
    if (!token) {
      res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }

    // Now verify the token with jwt secret
    const userToken = jwt.verify(token, JWT_SECRET);

    req.user = userToken.user; // extract that userid nd set it into req.user
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
