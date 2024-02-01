const mongoose= require('mongoose')
const user = require('../models/user')
const bcrypt= require('bcrypt')


var url = 'mongodb://127.0.0.1:27017/library'

exports.getPageRegister= async function(req,res,next){
    res.render('register',{verifUser:req.session.userId,message:req.flash('error')[0]})
}

// SIGN UP
exports.signup = async function (req, res) {
    try {
        await mongoose.connect(url);
        const {name, email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser) {

            req.flash('error','User with this email already exists.')
            res.render('register',{verifUser:req.session.userId,message:req.flash('error')[0]})
            return;
        }
        var hashpassword = await bcrypt.hash(password, 10);
        let User = new user({
            name:name,
            email:email,
            password:hashpassword,
           
        });
         await User.save();
         res.redirect('/login')

    } catch (error) {
        console.error(error);
    }
    finally{
        mongoose.disconnect();
    }
}

exports.getPageLogin= async function(req,res,next){
    res.render('login',{verifUser:req.session.userId,message:req.flash('error')[0]})
}


// Sign In 
exports.signin = async function (req, res) {
    try {
        await mongoose.connect(url); // Connect to the MongoDB database

        const { email, password } = req.body;
        const User = await user.findOne({ email });  // Use the 'user' model

        if (!User) {
            req.flash('error','invalid mail')
            res.render('login',{verifUser:req.session.userId,message:req.flash('error')[0]});
            return;
        }

        const passwordMatch = await bcrypt.compare(password, User.password);

        if (!passwordMatch) {
            req.flash('error','incorrect password')
            res.render('login',{verifUser:req.session.userId,message:req.flash('error')[0]});
            return;
        }

        // If authentication is successful, store the user ID in the session
        req.session.userId = User.id;
        res.redirect('/');
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect(); // Disconnect from the MongoDB database
    }
};

exports.logout = function(req,res){
    req.session.destroy(()=>{
        res.redirect('/login')
    })
}