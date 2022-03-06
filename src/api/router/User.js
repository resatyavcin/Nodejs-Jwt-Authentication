const express = require('express');

const router = express.Router();

const User = require('../model/User');

//REGISTER ENDPOINT
router.post('/register', async (req, res) => {
    const {email, username, password} = req.body;

    const user = {
        email,
        username,
        password
    }

    try {
        await User.create(user);

        return res.status(201).send(user)

    } catch (err) {
        return res.status(400).send(err);
    }

});

//FETCH ALL USERS ENDPOINT
router.get('/users', async (req, res) => {
    try {
        const user = await User.find({});
        return res.status(200).send(user)
    } catch (err) {
        return res.status(500).send("An error was encountered.")
    }
});


//FETCH USER BY ID ENDPOINT
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById({_id});

        if (!user) {
            return res.status(404).send("User not found.")
        }
        return res.status(200).send(user);

    } catch (err) {
        return res.status(500).send("An error was encountered.")
    }
});

//UPDATE USER BY ID ENDPOINT
router.patch('/users/:id', async (req, res) => {

    const _id = req.params.id;

    const updates = Object.keys(req.body);
    const allowUpdates = ['username', 'email', 'password'];

    const isValidOperation = updates.every((update) => allowUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send("Invalid updates!");
    }

    try {
        const user = await User.findByIdAndUpdate({_id}, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).send("User not found.")
        }

        return res.status(200).send(user);

    } catch (err) {
        return res.status(500).send("An error was encountered.")
    }
});

//DELETE USER BY ID ENDPOINT

router.delete('/users/:id', async (req, res)=>{
    const _id = req.params.id;

    try{
        const user = await User.findByIdAndDelete({ _id });

        if (!user) {
            return res.status(404).send("User not found.")
        }

        return res.status(200).send(user);

    }catch (err){
        res.status(500).send("An error was encountered.");
    }
});

module.exports = router;