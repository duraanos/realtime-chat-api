const jwt = require('jsonwebtoken');

const generateToken = (payload: string | object) => {
  const jwtSecret = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' };

  const token = jwt.sign(payload, jwtSecret, options);
  return token;
};


