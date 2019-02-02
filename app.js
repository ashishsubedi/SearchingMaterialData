const express = require('express');
const helmet = require('helmet');

const PORT = process.env.PORT||3000;
 
const app = express();

const indexRouter = require('./routes/index');


app.use(helmet());
 
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
 
app.use('/', indexRouter);



 
app.listen(PORT,console.log(`Express Server started at port ${PORT}`));