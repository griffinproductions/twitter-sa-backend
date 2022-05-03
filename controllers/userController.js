import jwt from 'jsonwebtoken';

const createToken = (id, name, perms) => jwt.sign({ id, name, perms }, process.env.JWT_SECRET, {
  expiresIn: '3d',
});

const handleErrors = (err) => {
  const errors = {};
  // user not found
  if (err.message === 'User not found') {
    errors.email = err.message;
    return errors;
  }

  // incorrect password
  if (err.message === 'Incorrect password') {
    errors.password = err.message;
    return errors;
  }

  if (err.code === 11000) {
    errors.email = 'Email already exists';
  }
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const userController = (User) => {
  const register = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.create({ email, password });
      const name = user.email.split('@')[0];
      const token = createToken(user._id, name, user.permissions);
      res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 3 });
      res.status(201).json({ name });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  };

  const login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.login(email, password);
      const name = user.email.split('@')[0];
      const token = createToken(user._id, name, user.permissions);
      res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 3 });
      res.status(200).json({ name });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  };

  const logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json(null);
  };

  const session = (req, res) => {
    try {
      const { name } = req.user;
      res.status(200).json({ name });
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

  const getKey = (req, res) => {
    try {
      return res.status(200).json({ key: req.cookies.jwt });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  };

  return {
    register, login, logout, session, getKey,
  };
};

export default userController;
