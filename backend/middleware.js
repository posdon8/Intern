const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Lấy token từ header Authorization (dạng 'Bearer token')
  console.log(token);
  if (!token) {
    return res.status(403).send('Access denied');
  }

  try {
    const decoded = jwt.verify(token, 'tamvu100523'); // 'yourSecretKey' là key dùng để giải mã token
    req.user = decoded;  // Lưu thông tin người dùng vào request object
    next();  // Tiếp tục xử lý request
  } catch (error) {
    return res.status(403).send('Invalid token');
  }
};

module.exports = { authenticateJWT };
