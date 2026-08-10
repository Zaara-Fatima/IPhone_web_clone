import jwt from "jsonwebtoken";
// import config from "../config/config.js";

export const protect = async (req, res, next) => {
    const token =
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        req.user = jwt.verify(
            token,
            process.env.ACCESS_SECRET
        );

        next();
    } catch {
        return res.status(401).json({
            message: "Token expired",
        });
    }
};