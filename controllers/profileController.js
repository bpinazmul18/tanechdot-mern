const { body, validationResult, } = require("express-validator");
const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports.updateName = async (req, res) => {
    const { name, id } = req.body;
    // console.log(name, id);
    if (name === '') {
        return res.status(400).json({
            errors: [{
                msg: 'Name is required!'
            }]
        })
    } else {
        try {
            const user = await User.findByIdAndUpdate(
                { _id: id, },
                { name: name },
                { new: true }
            )
            const token = jwt.sign(
                { user },
                process.env.SECRET,
                { expiresIn: '7d' }
            );
            return res.status(200).json({
                token,
                msg: 'Your name has been updated'
            })
        } catch (error) {
            return res.status(500).json({
                error
            })
        }
    }
}

module.exports.updatePasswordValidation = [
    body("current").not().isEmpty().trim().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New Password must be greater than 6 character")
];

module.exports.updatePassword = async (req, res) => {
    const { current, newPassword, userId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        const user = await User.findOne({
            _id: userId
        });
        // console.log(user);
        if (user) {
            const match_password = await bcrypt.compare(current, user.password);
            if (!match_password) {
                return res.status(400).json({ errors: [{ msg: 'Current Password is not correct' }] });

            } else {
                try {
                    const salt = await bcrypt.genSalt(10);
                    const hash_password = await bcrypt.hash(newPassword, salt);

                    const newUser = await User.findOneAndUpdate(
                        { _id: user },
                        { password: hash_password },
                        { new: true }
                    );
                    return res.status(200).json({
                        msg: 'Your password has successfully changed',
                    });

                } catch (error) {
                    return res.status(500).json({ errors });
                }
            }
        }
    }
}