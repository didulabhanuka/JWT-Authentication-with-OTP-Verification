import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import OTP from '../models/otpModel.js';
import { registerValidation, loginValidation } from '../utils/validation.js';

// Generate and send OTP
export const signUpRequest = async (req, res, next) => {
    const { name, email, contactNumber, password } = req.body;

    // Validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the database
    const emailExist = await User.findOne({ email });
    if (emailExist) return res.status(400).send("Email already exists");

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    // Send OTP via email to the user-provided email (entered in the form)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your sending email address
            pass: process.env.EMAIL_PASS  // Your email password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,  // Your sending email address
        to: email,                     // The user's email address (from the form)
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    try {
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send("Error sending OTP email.");
            }

            // Save OTP in the database with expiration
            const otpData = new OTP({
                email,
                otp,
                expiresAt: new Date(Date.now() + 5 * 60000) // OTP expires in 5 minutes
            });
            await otpData.save();

            res.status(200).send("OTP sent successfully. Please verify OTP to complete registration.");
        });
    } catch (error) {
        res.status(500).send("Error sending OTP.");
    }
};

// Verify OTP and complete registration
export const signUpVerify = async (req, res, next) => {
    const { email, otp, name, contactNumber, password } = req.body;

    // Find OTP in the database
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
        return res.status(400).send("OTP not found. Please request OTP again.");
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < Date.now()) {
        return res.status(400).send("OTP expired. Please request OTP again.");
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
        return res.status(400).send("Invalid OTP.");
    }

    // If OTP is valid, register the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        contactNumber,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        await OTP.deleteOne({ _id: otpRecord._id }); // Optionally delete OTP record
        res.status(200).send("User registered successfully.");
    } catch (err) {
        res.status(400).send(err);
    }
};

// Sign In
const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    // Validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user exists
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(400).send("Email doesn't exist");

    // Check password
    const validPwd = await bcrypt.compare(password, user.password);
    if (!validPwd) return res.status(400).send("Invalid password");

    // Create and assign a token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ message: "Auth successful", ...user, token });
};


export default {
    signUpRequest,
    signUpVerify,
    signIn
};
