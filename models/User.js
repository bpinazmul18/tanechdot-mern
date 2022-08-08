const { model, Schema } = require("mongoose");
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

// mongodb will create a document by using 'user(s)' this name
module.exports = model("user", userSchema);

