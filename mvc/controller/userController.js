import userModel from '../model/userModel.js';
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import cloudinary from '../../config/cloudnary.js';

//---------------------- for registering the user---------
export const userRegister = async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, password, phone } = req.body;
        const profilePic = req?.files?.profilePic
        const findUser = await userModel.findOne({ $or: [{ email: email }, { username: username }] });


        if (findUser) {
            res.status(500).json("your email is alreay exits please login to continue");
        } else {
            if (username && password && phone && profilePic) {
                const hasedPassword = await bcrypt.hash(password, 10);
                const profileResult = await cloudinary.uploader.upload(profilePic.tempFilePath)
                if (profileResult?.url) {
                    const user = new userModel({
                        username: username,
                        email: email,
                        phone: phone,
                        password: hasedPassword,
                        profilePic: profileResult?.url
                    });

                    await user.save();
                    // genrating jwt token
                    const newUser = await userModel.findOne({ email: email });
                    const token = Jwt.sign(
                        { userId: newUser._id },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "5d",
                        }
                    );


                    res.status(201).json({
                        message: "user registered succesfully",
                        success: true,
                        status: 201,
                        token: token,

                    });
                }

            } else {
                if (username && password && phone) {
                    const hasedPassword = await bcrypt.hash(password, 10);

                    const user = new userModel({
                        username: username,
                        email: email,
                        phone: phone,
                        password: hasedPassword,

                    });

                    await user.save();
                    // genrating jwt token
                    const newUser = await userModel.findOne({ email: email });
                    const token = Jwt.sign(
                        { userId: newUser._id },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "5d",
                        }
                    );



                    res.status(201).json({
                        message: "user registered succesfully",
                        success: true,
                        status: 201,
                        token: token,

                    });
                }else{

                res.json({
                    message: "all fields are required",
                    success: false,
                    status: 500,
                });
                }

            }
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};
//---------------------- for getting all the user---------

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userModel.find().select('-password');
        res.json({
            message: "user registered succesfully",
            success: true,
            status: 201,
            data: allUsers,
        });
    } catch (error) {
        console.log(error);
    }
};



//---------------------- for Logging In the user---------

export const userlogin = async (req, res) => {
    try {
        const {  email, password } = req.body;
        const findUser = await userModel.findOne({ $or: [{ email: email }, { username: email }] });
        // const findUser = await userModel.findOne({username:username})
console.log(findUser)
        if (findUser) {
            const decodedePassword = await bcrypt.compare(
                password,
                findUser.password
            );

            if (decodedePassword) {
                const token = Jwt.sign(
                    { userId: findUser._id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "5d",
                    }
                );
                res.status(200).json({
                    message: "login successfull..",
                    success: true,
                    status: 200,
                    token: token,
                });
            } else {
                res.status(401).json({
                    message: "invalid username or password",
                    success: false,
                    status: 401

                });
            }
        } else {
            res.status(404).json({
                message: "you are not a registered user",
                success: false,
                status:404
            });
        }
    } catch (error) {
        console.log(error);
    }
};

//---------------------- for getting the user by Id---------

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findById(id).select('-password');
    res.json({
        message: "your user here",
        success: true,
        status: 200,
        data: user,
    });
};



// ------------------------for user reset password -----------------

export const sendUserEmail = async (req, res) => {
    const { email } = req?.body;
    try {
        if (email) {
            const user = await userModel.findOne({ email: email });
            if (user) {
                const secret = user?._id + process.env.JWT_SECRET;

                const token = Jwt.sign({ userId: user._id }, secret, {
                    expiresIn: "15m",
                });
                const link = `http://localhost:3000/api/auth/reset/password/${user._id}/${token}`;
                console.log(link);
                res.send(
                    "email sent successfully please check your email to reset your password "
                );
            } else {
                res.json({
                    message:
                        "This email is not registered with any account please check your email",
                    status: 404,
                    success: false,
                });
            }
        } else {
            res.send("please provide your email address");
        }
    } catch (error) {
        console.log(error);
    }
};

export const resetUserPassword = async (req, res) => {
    const { password } = req?.body;
    const { id, token } = req.params;

    try {
        if (password) {
            const user = await userModel.findById(id);
            if (user) {
                const secret = user._id + process.env.JWT_SECRET;
                Jwt.verify(token, secret);
                const hasedPassword = await bcrypt.hash(password, 10);
                await userModel.findByIdAndUpdate(user._id, {
                    $set: { password: hasedPassword },
                });
                res.json({
                    message: "password changed successfully...",
                    success: true,
                    status: 200,
                });
            } else {
                res.send("no user exits");
            }
        } else {
            res.send("please provide your new password");
        }
    } catch (error) {
        console.log(error);
    }
};

// ------------------------for user change password -----------------

export const changeUserPassword = async (req, res) => {
    const { password } = req?.body;
    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(req.user);
            await userModel.findByIdAndUpdate(req?.user?._id, {
                $set: { password: hashedPassword },
            });
            res.json({
                message: "password changed succesfully",
                status: 200,
            });
        } else {
            res.send("password required");
        }
    } catch (error) {
        console.log(error);
    }
};

// ------------------------for logged in user  -----------------
export const loggedInUser = async (req, res) => {
    res.json({
        message: "success",
        user: req?.user,
    });
};
