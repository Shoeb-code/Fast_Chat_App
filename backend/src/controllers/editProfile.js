import User from "../models/User.js";
import { uploadImageToCloudinary } from "../services/cloudinaryService.js";

export const editProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body); // DEBUG
    console.log("FILE:", req.file); // DEBUG

    const { fullname, phone, bio } = req.body || {}; // ✅ SAFE DESTRUCTURE

    const updateData = {};

    if (fullname) updateData.fullname = fullname;
    if (phone) updateData.phone = phone;
    if (bio) updateData.status = bio;

    // Image upload
    if (req.file) {
      const photoUrl = await uploadImageToCloudinary(
        req.file.buffer,
        "fastchat/profile"
      );

      updateData.photo = photoUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Edit profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};