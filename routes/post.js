const express = require('express');

const profile = require('../models/profile');
const Users = require('../models/user')

const router = express.Router();

router.post('/posts/:username/:post_id',isAuthenticated,async (req,res)=>{
    try {
        const user = req.user.username
        const id = req.params.post_id
        const postUser = await profile.findOne({username:req.params.username})
        const post = postUser.posts.find(p=>p._id.toString()===id)
        console.log(post)
        const index = postUser.posts.indexOf(post)

        if(post.likes.includes(user)){
            postUser.posts[index].likes.pull(user)
            await postUser.save()
        }
        else {
            postUser.posts[index].likes.push(user)
            await postUser.save()
            await profile.findOneAndUpdate(
                {username:req.params.username},
                {$push: {notifications:{$each:[`${req.user.name} liked your post.`],$position:0}}},
                {new: true}
              )
        }        

        const followers = postUser.followers
        for (let i = 0; i < followers.length; i++) {
            const follower = await profile.findOneAndUpdate(
                { username: followers[i] },
                {$set: {"feed.$[elem].likes": post.likes}},
                {arrayFilters: [{ "elem.content": post.image }], new: true},
            )
        }

        
    } catch (error) {
        console.log(error.message)
        res.send('something went wrong')
    }
})

router.post('/comments/:username/:post_id',isAuthenticated,async (req,res)=>{
    try {
        const user = await profile.findOne({username:req.user.username})
        const name = user.name
        const id = req.params.post_id
        const postUser = await profile.findOne({username:req.params.username})
        const post = postUser.posts.find(p=>p._id.toString()===id)
        const index = postUser.posts.indexOf(post)

        postUser.posts[index].comments.push({username:name,content:req.body.comments})

        await postUser.save()

        const followers = postUser.followers
        for (let i = 0; i < followers.length; i++) {
            const follower = await profile.findOneAndUpdate(
                { username: followers[i] },
                {$push: {"feed.$[elem].comments": { username: name, content: req.body.comments }}},
                {arrayFilters: [{ "elem.content": post.image }],new: true},
            )
        }

        await profile.findOneAndUpdate(
            {username:req.params.username},
            {$push: {notifications:{$each:[`${req.user.name} commented on your post.`],$position:0}}},
            {new: true}
          )

        res.send('comment sent')

    } catch (error) {
        console.log(error.message)
        res.send('something went wrong')
    }
})

function isAuthenticated(req, res, next) {
    if (req.user) return next();
  
    res.redirect('/login')
  }

module.exports = router;
