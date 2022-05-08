import jwt from 'jsonwebtoken';

const authController = () => {
  const checkOrigin = (req, res, next) => {
    const { origin } = req.headers;
    if (origin !== 'http://localhost:3000') return res.status(403).json({ message: 'Access Denied' });
    return next();
  };

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

  const permissions = (req, res, next) => {
    if (req.user.perms !== 'admin' && req.user.perms !== 'broadcaster') return res.status(403).json({ message: 'You do not have permission to use this feature.' });
    req.canUse = true;
    return next();
  };

  const canUseAPI = (req, res, next) => {
    console.log(req.headers);
    const { origin } = req.headers;
    if (origin === 'http://localhost:3000') return next();
    const token = req.cookies.jwt;
    console.log(req.cookies);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.perms === 'admin' || decoded.perms === 'broadcaster') return next();
      return res.status(403).json({ message: 'Access Denied' });
    } catch (ex) {
      return res.status(400).send('Invalid token.');
    }
  };

  return {
    checkOrigin,
    auth,
    permissions,
    canUseAPI,
  };
};

export default authController;
