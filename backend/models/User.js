const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const bcrypt = require('bcryptjs');

// Định nghĩa model người dùng
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true, // Username phải duy nhất
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user', // Mặc định là user
    allowNull: false,
  },
  
}, {
  timestamps: false, // Vì bạn đã có trường `created_at`, không cần tự động tạo `createdAt` và `updatedAt`
  tableName: 'Users', // Tên bảng trong cơ sở dữ liệu
});

// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
User.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10); // Mã hóa mật khẩu
  }
});

// Phương thức kiểm tra mật khẩu khi đăng nhập
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
