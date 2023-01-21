const { body, validationResult } = require('express-validator');
module.exports.Uservalidation = [
    body('name').isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
]






