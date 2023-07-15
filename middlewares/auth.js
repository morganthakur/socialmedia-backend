import jwt from "jsonwebtoken";
import userModel from "../mvc/model/userModel.js";

export const checkUserAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    try {
        if (authorization && authorization.startsWith("Bearer")) {
            const { userId } = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(userId).select('-password');

            next();
        }
    } catch (error) {
        console.log(error);
        res.json({
            message: "unAuthorized user",
            error: error,
            status: 401
        });
    }
    if (!token) {
        res.json({
            message: "unAuthorized user no token",
            status: 401,
        });
    }
};

// export default checkUserAuth;
