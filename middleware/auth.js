import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ errors: { global: 'No token provided' } });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (ex) {
    return res.status(400).send('Invalid token.');
  }
};

export default auth;
