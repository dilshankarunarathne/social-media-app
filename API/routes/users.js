const router = require("express").Router();
const { json } = require("body-parser");
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            catch(error){
                return res.status(500).json(error);
            }
        }

        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            res.status(200).json("Account has been updated")
        }catch(error){
            return res.status(500).json(error);
        }
     } 
     else{
            return res.status(403).json("You can update only your account");
        }
});

//delete user
router.delete("/:id", async (req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findOneAndDelete(req.params.id);
            res.status(200).json("Account has been deleted")
        }catch(error){
            return res.status(500).json(error);
        }
     } 
     else{
            return res.status(403).json("You can delete only your account!");
        }
});


//get a user
router.get("/", async (req,res) =>{
    const userId = req.query.userId;
    const username = req.query.username;
        try{
            const user = userId
            ? await User.findById(userId) 
            : await User.findOne({username:username});
            const {password,updatedAt, ...other} = user._doc
            res.status(200).json(other)
        }catch(error){
            return res.status(500).json(error);
        }
});

//follow a user
router.put("/:id/follow", async (req,res) =>{
    if(req.body.userId !== req.params.id){ //check users are same or not
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){ //current user not following this user
                await user.updateOne({ $push: {followers: req.body.userId}}); //update this followers
                await currentUser.updateOne({ $push: {followings: req.params.id}}); // and following
                res.status(200).json("user has been followed");
            }
            else{
                res.status(403).json("you allready follow this user")
            }
        } catch (error) {
            res.status(500),json(error);
        }
    }
    else{
        res.status(403).json("you cant follow yourself");
    }
    
    });

//unfollow a user
router.put("/:id/unfollow", async (req,res) =>{
    if(req.body.userId !== req.params.id){ //check users are same or not
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){ //current user not following this user
                await user.updateOne({ $pull: {followers: req.body.userId}}); //update this followers
                await currentUser.updateOne({ $pull: {followings: req.params.id}}); // and following
                res.status(200).json("user has been unfollowed");
            }
            else{
                res.status(403).json("you dont follow this user")
            }
        } catch (error) {
            res.status(500),json(error);
        }
    }
    else{
        res.status(403).json("you cant unfollow yourself");
    }
    
    });


router.get("/",(req,res)=>{
    res.send("hey its user route")
});

module.exports = router;