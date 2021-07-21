
var express = require('express')
var app = express()

var bodyParser = require('body-parser');
var mongoose = require('mongoose')

var fs = require('fs');
var path = require('path');
const bcrypt = require('bcryptjs')

mongoose.connect("mongodb://localhost:27017/Room_Share", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connection Successfull...."))
    .catch((err) => console.log(err));

// Step 4 - set up EJS

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
const static_path = path.join(__dirname, "./public");
app.use(express.static(static_path));

// Step 5 - set up multer for storing uploaded files

var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

var imgModel = require('./models/model');
var Resgister = require('./models/register');

const { Script } = require('vm');

//Setting Entry point i.e login & register
app.get('/', (req, res) => {
    res.render('login');
})

//About section
app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/home', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        } else {
            /* if (check == true) */
            {
                res.render('home', { items: items });
            }
        }
    });
});

app.get('/adsearch', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        } else {
            /* if (check == true) */
            {
                res.render('adsearch', { items: items });
            }
        }
    });
});

//search
app.get('/search', (req, res) => {
    try {
        imgModel.find({ $or: [{ name: { '$regex': req.query.dsearch } }] }, (err, items) => {
            if (err) {
                console.log(err);
            } else {
                res.render('adsearch', { items: items });
            }
        })
    } catch (error) {
        console.log(error);
    }
});
//testbutton
app.get('/test', (req, res) => {
    const btn = req.query.id;
    console.log(btn)
    imgModel.find({ _id: btn }, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        } else {
            /* if (check == true) */
            {
                res.render('test', { items: items });
            }
        }
    });
});


//login page

app.get('/login', (req, res) => {
    res.render('login');
})

//logout    
app.get('/logout', (req, res) => {
    res.render('login');
})

// Step 8 - the POST handler for processing the uploaded file

app.post('/', upload.single('image'), (req, res, next) => {

    var obj = {
        name: req.body.name,
        town: req.body.town,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        desc: req.body.desc
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            // item.save();
            res.redirect('/home');
        }
    });
});

//register $ login

app.post("/register", (req, res) => {
        try {
            const password = req.body.password;
            const cpassword = req.body.confirmpassword;
            console.log("saving");
            if (password === cpassword) {

                const registerUser = new Resgister({
                    userid: req.body.userid,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: password,
                    confirmpassword: cpassword
                })
                registerUser.save();
                console.log("Data saved")
                res.status(201).render("login");

            } else {
                res.send("password are not matching")
            }

        } catch (error) {
            res.status(400).send(error);
        }

    })
    //login check
app.post("/login", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Resgister.findOne({ email: email });
        console.log(useremail);

        if (useremail) {
            const isMatch = await bcrypt.compare(password, useremail.password);
            if (!isMatch) {
                console.log("password failure")
                console.log(isMatch)
                res.status(400).json({ Error: "Login failed Invalid credentials" })
            } else {
                res.redirect('/home');
                //res.json({ message: "User Signed in successfully" })
                //res.render('home')
            }

        }


    } catch (error) {
        res.status(400).send("invalid email")
    }


})



var port = process.env.PORT || '5000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})