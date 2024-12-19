// models/Product.js
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
    allowNull: true, // assuming image is optional
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'Products',
  timestamps: false, // Disable automatic timestamp fields if not needed
});

module.exports = Product;
