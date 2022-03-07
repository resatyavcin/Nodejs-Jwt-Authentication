const jwt = require('jsonwebtoken');
const User = require('../model/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

        const user = await User.findOne({_id: decoded._id, 'tokens.token': token });

        console.log(user)

        if(!user){
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send("Please authenticate");
    }
}

module.exports = auth;