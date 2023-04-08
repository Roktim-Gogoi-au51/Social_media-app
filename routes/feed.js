const express = require('express');

const profile = require('../models/profile');

const router = express.Router();

router.get('/feed',isAutheticated,async (req,res)=>{
    const data = await profile.findOne({username:req.user.username})
    res.render('feed',{data,user:req.user.username})
})

router.get('/notification',isAutheticated,async (req,res)=>{
  const data = await profile.findOne({username:req.user.username})
  res.render('notification', {data})
})

function isAutheticated(req, res, next) {
    if (req.user) return next();
  
    res.redirect('/login')
  }

module.exports = router