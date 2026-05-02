
import express from "express"
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import { generateAccessToken,generateRefreshToken} from "../utils/generateTokens.js";


// Register Function
 export const register = async(req,res)=>{

       const {email,name,password}=req.body;
       
       if(!email || !name || !password){
          return res.status(400).json({success:false, message:"Credentials Missing"});
       }
    try {
            const isEmailRegister= await User.findOne({email});

            if(isEmailRegister){
                 return res.status(409).json({success:false,message:" Email already Register"})
            }
            const hashedPassword=  await bcrypt.hash(password,10);

          const user = await User.create(
            {  email,
               fullname:name,
               password:hashedPassword,
            }
            );

            const refreshToken = generateRefreshToken(user._id);
            const accessToken =generateAccessToken(user._id);

            res.cookie('refreshToken',refreshToken,{
               httpOnly:true,
               secure:false,
               sameSite:'lax',
               maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            user.refreshToken=refreshToken;
            await user.save();

          return res.status(201).json({
            success:true,
            accessToken,
            user,
            message:"User registered successfully"
         });

    } catch (error) {
          console.log("Error during Registration : ",error)
          res.status(500).json({success:false,message:error.message})
    }
}


//login 
 export const login =async(req,res)=>{
  try {
        const {email,password}=req.body;

         

        if(!email || !password){
          return res.status(400).json({success:false, message:"email and password required"})
        }
        const user=await User.findOne({email});

        if(!user){
          return res.status(404).json({success:false, message:"User not Registered"})
        }

        const hashedPassword = await bcrypt.compare(password,user.password);
       
        if(!hashedPassword){
          return res.status(401).json({success:false, message:"Invalid Credentials"});
        }

        const refreshToken = generateRefreshToken(user._id);
        const accessToken=generateAccessToken(user._id)
  
      user.refreshToken = refreshToken;
  
      await user.save();

      res.cookie(
        "refreshToken",
        refreshToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge:
            7 * 24 * 60 * 60 * 1000,
        }
      );

      return res.status(200).json({
        success: true,
        message: "User login successfully",
        accessToken,
        user
      });

  } catch (error) {
       return res.status().json({success:false,error})
  }
 }





// logout 

export const logout = async (req, res) => {
  try {
    const userId = req.user.id

    await User.findByIdAndUpdate(userId, {
      refreshToken: null
    })

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    })
  }
}

