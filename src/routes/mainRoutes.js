const express = require('express');
//const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dburl = 'mongodb+srv://ali:ali123@cluster0-mcnq9.mongodb.net/test?retryWrites=true';
const dbName = 'myClassDaysDB';

const router = express.Router();
// support parsing of application/json type post data
router.use(express.json());

//support parsing of application/x-www-form-urlencoded post data
router.use(express.urlencoded({ extended: true }));
router.route('/').get((req, res) => {
    res.render('index');
});
router.route('/register').get((req, res) => {
    res.render('register', { message: '' });
});
router.route('/register').post((req, res) => {
    console.log(req.body.email);
    var email = req.body.email;
    var pass = req.body.pass;
    if (req.body.pass != req.body.pass2) {
        res.render('register', { message: 'your passes donont match' });
    } else {
        var user = {
            email: email,
            pass: pass
        };
        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(dburl, { useNewUrlParser: true });
                const db = client.db(dbName);
                console.log(user.email);

                let validity = await db.collection('users').findOne({email:user.email});
                console.log(validity);
                if (!validity) {
                    const response = await db.collection('users').insertOne(user);
                    res.render('register',{message:'you are singed up!'});
                } else {
                    client.close();
                    res.render('register', { message: 'there is a user with the same email' });

                }

            } catch (error) {
                res.send('error');
            }
            client.close();
        }());
    }

    ///  console.log(req.body.email);
    //res.render('register',{});
});
router.route('/about').get((req, res) => {

    res.render('about', {});
});

module.exports = router;