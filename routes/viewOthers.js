const express = require('express');

const profile = require('../models/profile');
const Users = require('../models/user')

const router = express.Router();

router.get('/searchuser',isAuthenticated, async(req,res)=>{
    try {
        const query = req.query.name
        const data = [];
        const users = await Users.find({
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { username: { $regex: query, $options: 'i' } }
            ]
          })
          if(users){
            for(let i=0; i<users.length; i++){
                var userdata = await profile.findOne({username:users[i].username})
                data.push(userdata)
             }
             res.render('search',{data:data})          
          }
          if(data.length==0){
            res.render('search',{data})
          }
        
    } catch (error) {
        console.log(error.message)
        res.send('something went wrong')
    }
})

router.get('/profile/:username', isAuthenticated, async (req,res)=>{
    try {
        const username = req.params.username;
        const data = await profile.findOne({username:username})
        res.render('otherProfile',{data:data,user:req.user.username})
    } catch (error) {
        console.log(error.message)
        res.send('something went wrong')
    }
})

router.get('/p/:username/:post_id',isAuthenticated,async (req,res)=>{
  try {
      const data = await profile.findOne({username:req.params.username})
      const post = data.posts.find(p=>p._id.toString()===req.params.post_id)
      res.render('viewPost',{data,post,user:req.user.username})
  } catch (error) {
      console.log(error.message)
      res.send('something went wrong')
  }
})

router.post('/follow/:username', isAuthenticated, async (req, res) => {
  try {
    const follower = req.user.username;
    const following = req.params.username;

    // Check if the user is already following the other user
    const isFollowing = await profile.findOne({
      username: follower,
    });

    if (isFollowing.following.includes(following)) {
      // User is already following, so unfollow
      await profile.updateOne(
        { username: follower },
        { $pull: { following: following } }
      );
      await profile.updateOne(
        { username: following },
        { $pull: { followers: follower } }
      );
    } else {
      // User is not following, so follow
      await profile.updateOne(
        { username: follower },
        { $push: { following: following } }
      );
      await profile.updateOne(
        { username: following },
        { $push: { followers: follower } }
      );
      await profile.findOneAndUpdate(
        {username:req.params.username},
        {$push: {notifications:{$each:[`${req.user.name} started following you.`],$position:0}}},
        {new: true}
      )
    }
  } catch (error) {
    console.log(error.message);
    res.send('Something went wrong');
  }
});


function isAuthenticated(req, res, next) {
    if (req.user) return next();
  
    res.redirect('/login')
  }

module.exports = router;