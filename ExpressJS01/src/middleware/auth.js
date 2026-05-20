require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    const exactWhiteList = ["/", "/register", "/login"];
    const prefixWhiteList = ["/products"];
    const isExactMatch = exactWhiteList.find(item => req.originalUrl === '/v1/api' + item);
    const isPrefixMatch = prefixWhiteList.find(item => req.originalUrl.startsWith('/v1/api' + item));
    if (isExactMatch || isPrefixMatch) {
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Lấy thêm _id từ database theo email
                const userInDB = await User.findOne({ email: decoded.email }).select('_id email name role');
                if (!userInDB) {
                    return res.status(401).json({ message: "Người dùng không tồn tại" });
                }

                req.user = {
                    _id: userInDB._id,
                    email: userInDB.email,
                    name: userInDB.name,
                    role: userInDB.role,
                };
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token bị hết hạn/hoặc không hợp lệ"
                });
            }

        } else {
            return res.status(401).json({
                message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn"
            });
        }
    }
}

module.exports = auth;