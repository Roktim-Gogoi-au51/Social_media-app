const express = require('express');
const cloudinary = require("cloudinary").v2;
const path = require('path');
const multer = require("multer");

const profile = require('../models/profile');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + ext);
  }
});

const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: "dqtlufpdw",
  api_key: "693254937154877",
  api_secret: "018xFWpxR5xt1rLfO9E9rKi0V4o"
});

const router = express.Router();

router.get('/profile', isAutheticated,async (req, res) => {
  
  try {
    const data = req.user
    const user = await profile.findOne({username:req.user.username})
    res.render("profile", { 'data': data, 'user':user })
  } catch (error) {
    console.log(error.message)
    res.status(500).send('something went wrong')
  }
  
})

router.get('/profile/edit', isAutheticated, (req,res)=>{
  res.render('editProfile')
})

router.post('/updateimage', upload.single('profileImage'), async (req, res) => {
  const user = req.user.username
  try {
    const result = await cloudinary.uploader.upload(path.join(__dirname, `../uploads/${req.file.filename}`))
    const userProfile = await profile.findOne({ username: user });
    if (!userProfile) {
      const Profile = new profile({
        username: req.user.username,
        profileImage: result.secure_url
      })

      await Profile.save();
    }
    else {
      const updatedProfile = await profile.findOneAndUpdate(
        { username: user },
        { profileImage: result.secure_url },
        { new: true }
      );
    }
    res.send('success')
  } catch (error) {
    console.log(error.message)
    res.send('something went wrong')
  }
})

router.post('/postimage', upload.single('image'), async (req, res) => {
  try {
    const user = req.user.username
    const result = await cloudinary.uploader.upload(path.join(__dirname, `../uploads/${req.file.filename}`))
    
    const addpost = await profile.findOneAndUpdate(
      { username: user },
      {$push: {posts:{caption: req.body.caption,image: result.secure_url}}},
      { new: true }
    );
    
    const userProfile = await profile.findOne({username:user})
    const post = userProfile.posts.find(p=>p.image===result.secure_url)

    const followers = userProfile.followers
    if(followers.length!==0){
      for(let i=0;i<followers.length;i++){
      
        await profile.findOneAndUpdate(
          {username:followers[i]},
          {$push: {feed:{$each:[{username:userProfile.username,name:userProfile.name,post_id:post._id,content:result.secure_url,caption:req.body.caption}],$position:0}}},
          {new: true}
        )
      }
    }
    

    res.send('success')
  } catch (error) {
    console.log(error.message)
    res.send('something went wrong')
  }
})

router.post('/editProfile', async (req, res) => {
  const user = req.user.username;

  try {
    const userProfile = await profile.findOne({ username: user });

    if (!userProfile) {
      const newProfile = new profile({
        username: req.user.username,
      });

      await newProfile.save();
    }
    if (req.body.name) {
      const updatedProfile = await profile.findOneAndUpdate(
        { username: user },
        { name: req.body.name },
        { new: true }
      );

    }
    if (req.body.bio) {
      const updatedProfile = await profile.findOneAndUpdate(
        { username: user },
        { bio: req.body.bio },
        { new: true }
      );

    }
    res.send('success')

  } catch (error) {
    console.log(error.message);
    res.send('Something went wrong');
  }
});


function isAutheticated(req, res, next) {
  if (req.user) return next();

  res.redirect('/login')
}

module.exports = router;