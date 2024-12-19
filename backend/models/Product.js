
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'Products',
  timestamps: false, 
});

module.exports = Product;
