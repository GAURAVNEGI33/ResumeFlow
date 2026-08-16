const { User } = require("../models");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Helper to generate the JWT token and profile object
function generateAuthData(user) {
  const profile = {
    id: user.id,
    email: user.email,
    name: user.name
  };

  const token = jwt.sign(profile, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user: profile };
}

/**
 * Register a new user
 * @param {*} req
 * @param {*} res
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const existingUser = await User.count({ where: { email } });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Email already registered.",
      });
    }

    const user = await User.create({ name, email, password });
    
    const authData = generateAuthData(user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: authData
    });
  } catch (error) {
    console.log("error in register", error);
    res.status(500).send({
      success: false,
      message: "Failed to register user.",
    });
  }
}

/**
 * Login user
 * @param {*} req
 * @param {*} res
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const authData = generateAuthData(user);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: authData
    });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).send({
      success: false,
      message: "Failed to login.",
    });
  }
}

/**
 * Logout user
 * @param {*} req
 * @param {*} res
 */
function logout(req, res) {
  try {
    res.status(200).send({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.log("error in logout", error);
    res.status(500).send({
      success: false,
      message: "Failed to logout.",
    });
  }
}

/**
 * Forgot password
 * @param {*} req
 * @param {*} res
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 15 minutes from now
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);

    // Save to user
    user.resetOtp = otp;
    user.otpExpiry = expiry;
    await user.save();
    
    // Send email with OTP
    const message = `Your password reset OTP is: ${otp}\nThis OTP is valid for 15 minutes.`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: message,
    });

    res.status(200).send({
      success: true,
      message: "An OTP has been sent to your email.",
    });
  } catch (error) {
    console.log("error in forgotPassword", error);
    res.status(500).send({
      success: false,
      message: "Failed to generate OTP.",
    });
  }
}

/**
 * Reset password
 * @param {*} req
 * @param {*} res
 */
async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Email, OTP and new password are required.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Check if OTP matches
    if (user.resetOtp !== otp.toString()) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Check if OTP is expired
    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).send({
        success: false,
        message: "OTP has expired.",
      });
    }

    // Update password
    user.password = newPassword;
    
    // Clear OTP fields
    user.resetOtp = null;
    user.otpExpiry = null;
    
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.log("error in resetPassword", error);
    res.status(500).send({
      success: false,
      message: "Failed to reset password.",
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
