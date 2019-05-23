const express = require('express');
//const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dburl = 'mongodb+srv://ali:ali123@cluster0-mcnq9.mongodb.net/test?retryWrites=true';
const dbName = 'myClassDaysDB';
const bcrypt = require('bcrypt');

const router = express.Router();
// support parsing of application/json type post data
router.use(express.json());
const session = require('express-session');
router.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
//support parsing of application/x-www-form-urlencoded post data
router.use(express.urlencoded({ extended: false }));
var sess;
router.route('/').get((req, res) => {
    res.render('index');
});
router.route('/index').get((req, res) => {
    res.render('index');
});
router.route('/register').get((req, res) => {
    res.render('register', { message: '' });
});
router.route('/register').post((req, res) => {
    sess = req.session;
    //sess.email = req.body.email;
console.log(sess.eamil);

    let email = req.body.email;
    let pass = req.body.pass;
    if (req.body.pass != req.body.pass2) {
        res.render('register', { message: 'your passes donont match' });
    } else {
        let hash = bcrypt.hashSync(pass, 10);
        let user = {
            email: email,
            pass: hash
        };
        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(dburl, { useNewUrlParser: true });
                const db = client.db(dbName);
                let validity = await db.collection('users').findOne({email:user.email});
                if (!validity) {
                    const response = await db.collection('users').insertOne(user);
                    res.render('register',{message:'ok'});
                } else {
                    client.close();
                    res.render('register', { message: 'ther is a user with the same email' });

                }

            } catch (error) {
                res.send('error');
            }
            client.close();
        }());
    }
});
router.route('/about').get((req, res) => {

    res.render('about', {});
});
router.route('/login').get((req, res) => {
let message = req.query.message;
    res.render('login', {message:message});
});
router.route('/admin').get((req, res) => {
   
});
router.route('/admin').post((req, res) => {
    let email = req.body.email;
    let pass = req.body.pass;
    let user = {
        email: email,
        pass: pass
    };
    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(dburl, { useNewUrlParser: true });
            const db = client.db(dbName);

            let validity = await db.collection('users').findOne({email:user.email});
            if (validity) {
                let comparePasses = bcrypt.compareSync(user.pass,validity.pass);
                if(comparePasses){
                    client.close();
                    res.render('admin',{});
                }else{
                let message = 'passes do not match'
                res.redirect('login/?message='+message);                  
                }
                
            } else {
                client.close();
                let message = 'there is no such a user'
                res.redirect('login/?message='+message);    
                // res.redirect('/?user=' + error);
            }

        } catch (error) {
            res.send(error.message);
        }
        client.close();
    }());
});
router.route('/blog').get((req, res) => {

    res.render('blog', {});
});
router.route('/contact').get((req, res) => {

    res.render('contact', {});
});
router.route('/listings').get((req, res) => {

    res.render('listings', {});
});

module.exports = router;