const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const bcrypt = require('bcryptjs');


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user', 
    allowNull: false,
  },
  
}, {
  timestamps: false, 
  tableName: 'Users',
});


User.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10); // Mã hóa mật khẩu
  }
});


User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
