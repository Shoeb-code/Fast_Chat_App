
import express from "express"
import User from "../models/User";
import bcrypt from 'bcryptjs';
import { generateAccessToken,generateRefreshToken} from "../utils/generateTokens";

// Register Function
 export const Register = async(req,res)=>{
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
               password:hashedPassword
            }
            );

            const refreshToken = generateRefreshToken(user._id);
            const accessToken =generateAccessToken(user._id);

            user.refreshToken=refreshToken;
            await user.save();

          return res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            message: "User registered successfully"
         });

    } catch (error) {
          console.log("Error during Registration : ",error)
          res.status(500).json({success:false,message:error.message})
    }
}

// logout 

export const logout =async (req,res)=>{

   try {
      const {email} =req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }
  
      const user= await User.findOne({email});

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      user.refreshToken=null;
      await user.save();
  
      return res.json({
        success: true,
        message: "Logged out",
      });

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: error.message,
       });
   }
}

