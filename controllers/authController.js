const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const signup = async(req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body
        if (!email || !password || !firstName || !lastName || !role) {
            return res.status(400).json({
                message: "details required. ",
                success: false
            })
        }
        const userExists = await User.findOne({
            email: email
        });
        if (userExists) {
            return res.status(400).json({
                message: "User exists",
                success: false
            });
        }
        const hashedPass = bcrypt.hash(password, 11);
        //creating a new 
        const newUser = await User.create({
            email,
            password: hashedPass,
            firstName,
            lastName,
            role
        })
        return res.status(200).json({
            msg: "User created successfully",
            success:true
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                msg: "email and password are required",
                success:false
            })
        }
        
        const userExists = await User.findOne({
            email:email
        })

        if (!userExists) {
            return res.status(400).json({
                msg: "User doen't doesn't exist, please signup first",
                success: false
            })
        }
        //jwt.sign=>used to create a token
        const token = jwt.sign(
            {
                //payload(samaan=>values)
                email: userExists.email,
                userId: userExists._id,
                role: userExists.role// Use the _id field of the MongoDB document
            },
            "jjj", // Replace with your secret key
            { expiresIn: "1h" } // Optional: Set token expiration
        )
        res.status(200).json({
            message: "Successfully logged in",
            success: true,
            token:token
            })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    
    }
}