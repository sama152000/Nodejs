const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Joi = require('joi');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const schema = Joi.object({
      username: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('user', 'seller').default('user')
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, email, password, role } = req.body;    

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'this email is already used' });
    }

    const newUser = await User.create({ username, email, password, role });

    res.status(201).json({
      message: 'Account created sucssefully ',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token: generateToken(newUser)
    });
  } catch (error) {
    res.status(500).json({ message: 'Eroor happen in account creation', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email or password is not valid' });
    }

    res.status(200).json({
      message: 'Login succeffuly',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error Happen in login', error: error.message });
  }
};
