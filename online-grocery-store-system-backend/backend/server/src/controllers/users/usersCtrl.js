const expressAsyncHandler = require('express-async-handler');
const User = require("../../model/User");
const generateToken = require('../../middlewares/generateToken');




const registerUser =expressAsyncHandler(async (req,res) =>{
    const{email,firstname,lastname,password} = req?.body;
    
    const userExists = await User.findOne({email});
    if( userExists)throw new Error('User already exists');
    try{
        //check if user exists
        
       
        const user = await User.create({email,firstname,lastname,password});
        res.status(200).json(user);
    }catch(error){
        res.json(error);
    }
});

//fetch all users
const fetchUsersCtrl = async(req,res) =>{
    try{
        const users=await User.find({});
        res.json(users);
    }catch(error){
        res.json(error);
    }
};

// Login user
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
    const { email, password } = req?.body;
    // Find the user in the database
    const userFound = await User.findOne({ email });

    // Check if the user password matches
    if (userFound && await userFound.isPasswordMatch(password)) {
        res.json({
            _id: userFound?._id,
            firstname: userFound?.firstname,
            lastname: userFound?.lastname,
            email: userFound?.email,
            isAdmin: userFound?.isAdmin,
            token: generateToken(userFound?._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// Update user details
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, password, isAdmin } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { firstname, lastname, email, password, isAdmin },
            { new: true }
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = {registerUser ,fetchUsersCtrl,loginUserCtrl,updateUserCtrl};