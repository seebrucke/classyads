const express = require('express');
const path = require('path');
const app = express();
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '/src/views'));
const rout = require('./src/routes/mainRoutes');
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',rout);
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})