const { body, validationResult, } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user) =>{
    return jwt.sign({user}, process.env.SECRET, {
        expiresIn : '7d'
    });
}

require('dotenv').config();

// register validation
module.exports.registerValiation = [
    body("name").not().isEmpty().trim().withMessage("Name is required"),
    body("email").not().isEmpty().trim().withMessage("Email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be grater than 6 character")
];


///////////////// register user ///////////////////
module.exports.register = async (req, res) => {
    // res.json(req.body);
    const { name, email, password } = req.body;
    // res.send(name+" "+email+" "+password);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // mongodb will find user by using 'findOne' method
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({ errors: [{msg: 'Email is already taken'}]});
        }

        // create password with "hash" before that,
        // create salt for making password more strong
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);
        
        // store user in mongodb
        try {
            const user = await User.create({
                // name and key same it means 
                // key : name (key == name)
                // name: name, that why we will use only key/name
                name,
                email,
                password: hash_password,
            });

            // create token for access user
            const token = createToken(user);
            return res
            .status(200)
            .json({msg: "Your account has been created", token});
        } catch (error) {
            // return error 500 (server internal error)
            return res.status(500).json({ errors: error })
        }
    } catch (error) {
        // return error 500 (server internal error)
        return res.status(500).json({ errors: error });
    }
}



////////////////// login validation /////////////////

module.exports.loginValiation = [
    body("email").not().isEmpty().trim().withMessage("Email is required"),
    body("password").not().isEmpty().withMessage("Password is required")
];
module.exports.login = async (req, res) => {
    const errors = validationResult(req);
    // check email or password field null or not
    if(!errors.isEmpty()){    
        return res.status(400).json({ errors: errors.array()});
    }

    // check valid email and password
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            const match_password = await bcrypt.compare(password, user.password);
            if(match_password){
                const token = createToken(user);
                return res
                .status(200)
                .json({msg : 'You have login successfully', token});
            }else{
                return res.status(401).json({errors : [{msg: 'Password is not correct'}]});
            }
        }else{
            return res.status(404).json({errors : [{msg: 'Email is not found'}]});
        }
    } catch (error) {
        return res.status(500).json({errors : error});
    }
}