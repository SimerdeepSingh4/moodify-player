const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistModel = require("../models/blacklist.model");

async function registerController(req, res) {
    const { email, username, password } = req.body;

    const isUserExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserExist) {
        return res.status(409).json({
            message: "User already exists" + (isUserExist.email === email ? " with this email" : "with this username")
        })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    return res.status(201).json({
        message: "User created successfully",
        user: {
            username: user.username,
            email: user.email
        }
    })
}

async function loginController(req, res) {
    const { email, username, password } = req.body;

    const user = await userModel.findOne(
        {
            $or: [
                { email: email },
                { username: username }
            ]
        }
    ).select("+password")
    if (!user) {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '3d' })

    res.cookie("token", token)

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            username: user.username,
            email: user.email
        }
    })
}

async function getMe(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"User fetched successfully",
        user
    })
}

async function logoutController(req,res) {
    const token = req.cookies.token;

    res.clearCookie('token')

    await blacklistModel.create({
        token
    })

    res.status(200).json({
        message:"User logged out successfully."
    })
}

module.exports = {
    registerController,
    loginController,
    getMe,
    logoutController
}