const express = require('express');

//Router
const router = express.Router();

//Model
const User = require('../model/User');

//Middleware
const auth = require('../middleware/auth');

//REGISTER ENDPOINT
router.post('/register', async (req, res) => {
    const {email, username, password} = req.body;


    const user = new User({
        email,
        username,
        password
    })

    try {
        await user.save();

        const token = await user.generateAuthToken();

        return res.status(201).send({user: user, token: token})

    } catch (err) {
        return res.status(400).send(err);
    }

});

//LOGIN ENDPOINT
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();

        res.send({user: user, token: token})

    } catch (err) {
        return res.status(500).send("An error was encountered.")
    }
});

//LOGOUT ENDPOINT
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save();

        res.status(200).send("Successfully Logout...")
    } catch (err) {
        return res.status(500).send("An error was encountered.")
    }
});

//LOGOUT ALL ACCOUNT ENDPOINT
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token === req.token;
        })
        await req.user.save();

        res.status(200).send("Successfully Logout all account...")

    } catch (err) {
        return res.status(500).send("An error was encountered.")
    }
});

//FETCH ALL USERS ENDPOINT
router.get('/users/me', auth, async (req, res) => {
    return res.status(200).send(req.user);
});


//UPDATE USER BY ID ENDPOINT
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowUpdates = ['username', 'email', 'password'];

    const isValidOperation = updates.every((update) => allowUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send("Invalid updates!");
    }

    try {

        updates.forEach((update) => req.user[update] = req.body[update]);

        await req.user.save();

        return res.status(200).send(req.user);

    } catch (err) {
        return res.status(500).send("An error was encountered.")
    }
});

//DELETE USER BY ID ENDPOINT
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        return res.status(200).send(req.user);

    } catch (err) {
        res.status(500).send("An error was encountered.");
    }
});

module.exports = router;