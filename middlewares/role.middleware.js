//role middleware 
const roleMid = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized: No user found" });
            }
            // seprate the role from req.user
            const role = req.user.role
            //check if that role is included in provided or allowed role 
            const isAllowed = roles.includes(role)
            //if not allowed
            if (!isAllowed) {
                return res.status(403).json({
                    message: "user is not allowed to use this service"
                })
            }
            next()
        } catch (error) {
            return res.status(500).json({ message: `internal server error: ${error.message}` })
        }
    }
}