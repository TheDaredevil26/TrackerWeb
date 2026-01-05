import express from "express"
import User from "../models/users.js"
import bcrypt from "bcrypt"

const router = express.Router();


router.post("/register", async (req,res)=>{
    const { email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ message: "Email and password are required." });
    }
    
    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
});

router.post("/login", async(req,res)=>{
    const { email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email});
    if(!user){
        return res.status(400).json({ message: "Invalid email or password." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({ message: "Invalid email or password." });
    }
    req.session.userId = user._id;
    res.json({ message: "Login successful." ,
        userId : user._id
    });
});
    
export default router;