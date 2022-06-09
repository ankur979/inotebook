const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../model/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middileware/fetchuser.js');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library')
require('dotenv').config()

const Signature = 'Ankur$123';

// user create router

router.post('/createuser', [
    body('name', 'Plases enter vilid name').isLength({ min: 3 }),
    body('email', 'Plases enter vilid email').isEmail(),
    body('password', 'Plases enter 5 characters password').isLength({ min: 5 }),
], async (req, res) => {
    // error message sent
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt)
        // Check email
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ err: "email id alredy exit" });
        }
        // user create
        user = await User.create({ name: req.body.name, password: secpass, email: req.body.email })
        const data = {
            user: {
                id: user.id
            }
        }

        const usertoken = jwt.sign(data, Signature)
        // res.json(user);
        res.json({ usertoken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// user login router

router.post('/login', [
    body('email', 'Plases enter vilid email id').isEmail(),
    body('password', 'Plases cannot be blank password').exists(),
], async (req, res) => {
    // error message sent
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ err: "Plases enter vilid email id and password" });
        }
        // user password compare to hash key
        let passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ err: "Plases enter vilid email id and password" });
        }


        const data = {
            user: {
                id: user.id
            }
        }

        const usertoken = jwt.sign(data, Signature)
        // res.json(user);
        res.json({ usertoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// user fatch data router

router.post('/fatchuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// router 3 

const client = new OAuth2Client({ clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID })
router.post('/google-login', async (req, res) => {
    const { tokenId } = req.body
    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID
    })
    try {
        const { email, email_verified, name } = ticket.getPayload()
        if (email_verified) {
            let user = await User.findOne({ email })
            if (user) {
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const usertoken = jwt.sign(data, Signature)
                // res.json(user);
                res.json({ usertoken })
            } else {
                let password = (email + name + "Ankur@kumar")
                user = await User.create({ name, password, email })
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const usertoken = jwt.sign(data, Signature)
                // res.json(user);
                res.json({ usertoken })
            }
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})



module.exports = router;