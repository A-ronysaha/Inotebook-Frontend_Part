let express = require("express");
let router = express.Router();
let User = require("../Schema/User");
let { Uservalidation } = require("../Express_Validation/Uservalidation");
const { body, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "Arghyaisagood$boy";

let Fetchuser = require('../Middleware/Fetchuser')

// testing api
router.get("/register", (req, res) => {
  res.send("Welcome to register form");
});

//1..** Create a USER using POST "/api/auth/user"  **//

router.post("/user", Uservalidation, async (req, res) => {
  
  let success = false
  // express_validation error check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
  try {
    let newUser = await User.findOne({ email: req.body.email });

    // Check user with same email
    if (newUser) {
      return res
        .status(400)
        .json({success, error: "Sorry, user with same emailid is already exists" });
    }

    const salt = bcrypt.genSaltSync(10); // generate salt
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Create new USER
    newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });

    const data = {
      user: { id: newUser.id },
    };
    const jwtAuthToken = jwt.sign(data, JWT_SECRET);
    res.json({success: true,jwtAuthToken }); // Normal response
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some Error has occured");
  }
});

//2..** Authenticate a USER using POST "/api/auth/login"  **//

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let existUser = await User.findOne({ email });
      if (!existUser) {
        success = false
        return res
          .status(400)
          .json({ Error: "Please try to login with correct credential" });
      }

      const passwordCompare = bcrypt.compareSync(password, existUser.password); // To compare a password
      if (!passwordCompare) {
        success = false
        return res
          .status(400)
          .json({ error: "Please try to login with correct credential" });
      } else {
        const data = {
          user: { id: existUser.id },
        };
        const jwtAuthToken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true,jwtAuthToken });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Invalid login credential");
    }
  }
);


//3..** Get loggedin User details using POST "/api/auth/getuser" & Login required  **//

router.post(
  "/getuser",Fetchuser,async (req, res) => {
  try {
    let loggedUserId = await User.findById(req.user.id).select("-password")
    // "select" argument choose everything related to login except which is pass as argument in select()
    res.send(loggedUserId)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Invalid login credential");
  }
})


 
