const Registration_model = require('../database/registration');

const makeUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email
});

const makeToken = (userId) => `auth-${userId}-${Date.now()}`;

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Registration_model.findOne({ email });
    if (existingUser) {
      return res.send({ success: false, message: 'email already exists' });
    }

    const newUser = new Registration_model({ name, email, password });
    await newUser.save();

    res.send({
      success: true,
      message: 'registered',
      token: makeToken(newUser._id),
      user: makeUserPayload(newUser)
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log('LOGIN DATA =', req.body);
    const { email, password } = req.body;

    const user = await Registration_model.findOne({ email });
    console.log('DATABASE USER =', user);

    if (!user) {
      return res.send({ success: false, message: 'user not found' });
    }

    if (user.password !== password) {
      return res.send({ success: false, message: 'wrong password' });
    }

    res.send({
      success: true,
      message: 'login success',
      token: makeToken(user._id),
      user: makeUserPayload(user)
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'server error' });
  }
};
