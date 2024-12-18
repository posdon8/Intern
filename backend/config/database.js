const { Sequelize } = require('sequelize');

// Cấu hình kết nối với MySQL
const sequelize = new Sequelize('poseidont', 'root', '100523', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306,
});
sequelize.authenticate()
  .then(() => console.log('Kết nối cơ sở dữ liệu thành công!'))
  .catch((error) => console.error('Không thể kết nối cơ sở dữ liệu:', error));

module.exports = sequelize;
