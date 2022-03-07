require('dotenv').config({ path: './.env' });
require('./src/config/db')();

const express = require('express');
const bodyParser = require('body-parser');

//Express app initialize
const app = express();

//Middleware use

app.use((req,res,next)=>{
    console.log(req.method, req.path);
    next();
})

app.use(express.json());
app.use(
    bodyParser.urlencoded({ extends: false })
);

//Routes
const userRouter = require('./src/api/router/User');


//Routes added
app.use('/auth', userRouter);


const port = 3000 || process.env.PORT

app.listen(port, ()=> console.log(`Listening app on ${port}`));