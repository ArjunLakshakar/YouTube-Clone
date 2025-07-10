import jwt from "jsonwebtoken";
import User from "../Model/UserSchema.js";
import bcrypt from "bcrypt";

export async function addUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate userId 
    const userCount = await User.countDocuments();
    const userId = `user${userCount + 1}`;

    // Create and save user
    const user = new User({
      userId,
      username,
      email,
      password: hashedPassword,
      avatar: "",
      channel: []
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function getUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      "secret123", 
      // { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        channels: user.channels,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
