const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const ejs = require('ejs')
const bodyParser = require('body-parser')

const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile")
const searchRoute = require("./routes/viewOthers")
const postRoute = require("./routes/post")
const feedRoute = require("./routes/feed")

const app = express()

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true, multipart: true}))

app.use(
    session({
      secret: 'pleasedonottouchthissecretkey',
      resave: false,
      saveUninitialized: false,
    })
);

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect('mongodb+srv://gogoiroktim:Gandhi213@cluster0.cl7jchy.mongodb.net/SocialDB?retryWrites=true&w=majority',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(()=>{
    console.log('connected succesfully to database')
})
.catch((err)=>{ 
    console.log(err.message)
})

app.use('/', authRoute);
app.use('/', profileRoute)
app.use('/', searchRoute)
app.use('/',postRoute)
app.use('/',feedRoute)

app.listen(3000,()=>{
    console.log('connected succesfully to server')
})