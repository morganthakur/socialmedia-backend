import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    profilePic:{
type:String,
default:null

    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        manlength: 50,
        unique: [true, "email must me unique "]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: [true, "email must me unique "],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("email is incorrect");
            }
        },
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                return value.toString().length == 10;
            },
            message: "mobile number is not valid",
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, "password must minimum 6 charchaters"],
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    token: String,
    hasVerified:{
        type:Boolean,
        default:false
    },
    accountType:{
        type: String, enum: ["public", "private"], default: "public"
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"

    }],
    story:[
       {
            type: mongoose.Types.ObjectId,
            ref: "story"
       }
    ]
        
    ,
    post:[{
        type:mongoose.Types.ObjectId,
        ref:"post"
    }],
    bio:{
        type:String
    }
});

const userModel = mongoose.model("user", userSchema);
export default userModel;
