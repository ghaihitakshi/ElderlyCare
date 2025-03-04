const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {
    try {
        const authToken = req.headers.authorization

        //Ensure that the token is provided
        if (!authToken) {
            return res.json({
                message: 'authToken is required'
                success: false
            }).status(401)
        }

        // Extract the actual token
        if (!authToken.startsWith("Bearer ")) {
            return res.status(400).json({
                msg: "Invalid token format",
            })
        }

        const jwtToken = authToken.split(" ")[1]
        console.log("JWT Token -->", jwtToken)

        // Verify the token
        const decodedValue = jwt.verify(jwtToken, "jjj")
        console.log("Decoded JWT -->", decodedValue)

        if (!decodedValue.email || !decodedValue.userId || !decodedValue.role) {
            return res.json({
                message: "token is invalid",
                success: false
            }).status(401)
        }
        req.user = decodedValue;
        next();
    } catch (error) {
        return res.json({
            message: "Authentication field",
            success: false
        }).status(500)  
    }
}


// router.post("/createTask",auth,createTask)