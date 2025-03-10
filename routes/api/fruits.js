const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {body,validationResult} = require('express-validator')
const bcrypt = require('bcrypt');
require('dotenv').config(); // Changed from 'abbrev' to 'dotenv' based on your db.js
const authenticateToken = require('./../../middleware/auth')

// Route to create a new fruit
router.post("/",
    [
        body("fruit_name","Fruit name is required").notEmpty(),
        body("email","email is required").notEmpty(),
        body("email","Email must a valid email address").isEmail(),
        body("password","password is required").notEmpty().isLength({min:6}),
    ], 
    async (req, res) => {
    try {
        const errors= validationResult(req)
        if(!errors.isEmpty()){
            return res.json({errors:errors.array()})
        }
        // Get the Fruit model from app.locals (set in server.js)
        const Fruit = req.app.locals.db.Fruit;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create fruit object with Sequelize
        const fruitNew = await Fruit.create({
            fruit_name: req.body.fruit_name,
            email: req.body.email,
            color: req.body.color,
            season: req.body.season,
            password: hashedPassword
        });

        res.json(fruitNew);
    } catch (error) {
        console.error('Error creating fruit:', error);
        res.status(500).json(`Something went wrong with the server: ${error.message}`);
    }
});

//! get all fruits
router.get("/all", async (req, res) => {
    // Get the Fruit model from app.locals (set in server.js)
    const Fruit = req.app.locals.db.Fruit;

    const allFruit = await Fruit.findAll();
    if (!allFruit) {
        res.status(404).json("Fruits not found");
    } else {
        res.json(allFruit)
    }
})


//!fruit login
router.post("/login", 
    [
        body("type","type is required and the type will be either 'email' or 'refresh'").notEmpty().isIn(['email','refresh'])
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({errors:errors.array()})
        }
        const Fruit = req.app.locals.db.Fruit;
    
        const { type, email, password, refreshToken } = req.body;
        if (type == 'email') {
            await handleEmailLogin(Fruit, email, res, password);
        } else {
            handleRefreshLogin(refreshToken, res, Fruit);
        }
    } catch (error) {
        res.json("something is wrong with the server")
    }
})


//!fruit profile
router.get("/profile", authenticateToken, async (req, res) => {
    const Fruit = req.app.locals.db.Fruit;
    const id = req.fruit.id;
    const requiredFruit = await Fruit.findByPk(id);
    if (!requiredFruit) {
        res.status(404).json("User not found")
    } else {
        res.json(requiredFruit)
    }
})

//!get a fruit by its id 
router.get("/:id", async (req, res) => {
    try {
        const Fruit = req.app.locals.db.Fruit;
        const required_id = req.params.id;
        const requiredFruit = await Fruit.findByPk(required_id);
        if (!requiredFruit) {
            res.status(404).json("required fruit not found")
        } else {
            res.json(requiredFruit)
        }
    } catch (error) {
        res.status(500).json("something is wrong with the server :")
        console.error(error.message)
    }
})

//! update a fruit by its id
// router.put("/:id", async (req, res) => {
//     const Fruit = req.app.locals.db.Fruit;
//     const body = req.body;
//     const requiredFruitID = req.params.id;
//     const requiredFruit = await Fruit.findByPk(requiredFruitID);
//     if (!requiredFruit) {
//         res.status(404).json("Required fruit is not found");
//     } else {
//         await requiredFruit.update(body)
//         res.json(requiredFruit);
//     }
// })
//! update fruit using its accesstoken
router.put("/", authenticateToken, async (req, res) => {
    const Fruit = req.app.locals.db.Fruit;
    const body = req.body;

    requiredFruitID = req.fruit.id;

    const requiredFruit = await Fruit.findByPk(requiredFruitID);

    if (!requiredFruit) {
        res.status(404).json("Required fruit is not found");
    } else {
        await requiredFruit.update(body)
        res.json(requiredFruit);
    }
})

//!delete a fruit by id
router.delete("/:id",async(req,res)=>{
    const Fruit = req.app.locals.db.Fruit;
    const requiredFruitID = req.params.id;
    const requiredFruit = await Fruit.findByPk(requiredFruitID)
    if(!requiredFruit){
        res.status(404).json("Required Fruit not found");
    }else{
        await requiredFruit.destroy()
        res.json(requiredFruit)
    }
})



module.exports = router;





function handleRefreshLogin(refreshToken, res, Fruit) {
    if (!refreshToken) {
        res.status(401).json("Unauthorized");
    } else {
        jwt.verify(refreshToken, process.env.JWT_SECRET, async (error, payload) => {
            if (error) {
                res.status(401).json("Unauthorized");
            } else {
                const requiredFruit = await Fruit.findByPk(payload.id);
                if (!requiredFruit) {
                    res.status(404).json("Required fruit not found");
                } else {
                    getUserTokens(requiredFruit, res);

                }
            }
        });
    }
}

async function handleEmailLogin(Fruit, email, res, password) {
    const requiredFruit = await Fruit.findOne({ where: { email: email } });
    if (!requiredFruit) {
        res.status(404).json("Required fruit not found");
    }
    else {
        const isValidPassword = await bcrypt.compare(password, requiredFruit.password);
        if (!isValidPassword) {
            res.json("Wrong password");
        } else {
            getUserTokens(requiredFruit, res);
        }
    }
}

function getUserTokens(requiredFruit, res) {
    const accessToken = jwt.sign({ id: requiredFruit.id, email: requiredFruit.email }, process.env.JWT_SECRET, { expiresIn: '2d' });
    const refreshToken = jwt.sign({ id: requiredFruit.id, email: requiredFruit.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const fruitJSON = requiredFruit.toJSON();
    fruitJSON.accessToken = accessToken;
    fruitJSON.refreshToken = refreshToken;
    res.json(fruitJSON);
}
