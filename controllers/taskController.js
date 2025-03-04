const mongoose = require('mongoose')
const User = require('../models/User')
const Task = require('../models/Task')
//task can only be created by the logged in user //account type of user should be elderly
//get all tasks
//create a task i.e. post a task update delete a task

//to check whether user is logged in or not

const createTask = async (req, res)=>{
    try {
      
        const { title, description, scheduledAt, reminderAt, status } = req.body
        if (!title || !description || !scheduledAt || !reminderAt || !status) {
            return res.json({
                message: "Provide all the values",
                success:false
            }).status(403)
        }
        const userId = req.user.userId;
        if (!userId) {
            return res.json({
                message: "userId not found",
                success:false
            }).status(403)
        }
        const newTask = await Task.create({
            title,
            description,
            scheduledAt,
            reminderAt,
            status,
            createdBy:userId // this is wrong
        })
        
        return res.json({
            message: 'Task successfully created',
            success:true
        }).status(200)
    } catch (error) {
        return res.json({
            message: 'Internal Server Error',
            success: false
        }).status(500)
    }
}

