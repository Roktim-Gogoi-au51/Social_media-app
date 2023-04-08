const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const router = express.Router()

const User = require('../models/user')
const profile = require('../models/profile')

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) return done(null, false);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser(async(id,done)=>{
    try {
        const user = await User.findById(id);
        done(null,user);
    } catch (error) {
        done(error,false);
    }
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/',(req,res)=>{
    res.render('register')
})

router.post('/register',async(req,res)=>{
    try {
        const user = await User.findOne({username: req.body.username});
        if(user) return res.status(400).send('username already exists');

        const newUser = new User(req.body);
        await newUser.save()
        const newProfile = new profile({
            username:req.body.username,
            fullName:req.body.name,
        })
        await newProfile.save()
        res.status(201).render('login')
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/feed', 
        failureRedirect: '/',
        failureFlash: true 
    })
);

router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err) return next(err);
        res.render("login")
    })
   
})

module.exports = router;
