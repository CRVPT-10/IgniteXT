const User = require('../models/user');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "All fields required" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, role });
    user.setPassword(password);
    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = user.generateJwt();
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
