const { createUserService, loginService, getUserService, updateUserService } = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    return res.status(200).json(data)
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);

    return res.status(200).json(data)
}

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data)
}

const getAccount = async (req, res) => {

    return res.status(200).json(req.user)
}

const updateProfile = async (req, res) => {
    const { name, phone, address } = req.body;
    const userId = req.user._id;
    const data = await updateUserService(userId, name, phone, address);
    return res.status(200).json(data);
}

module.exports = {
    createUser, handleLogin, getUser, getAccount, updateProfile
}