const sequelize = require('./database.js');
const User = require('./models/User.js');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối tới MySQL thành công!');
    
    // Đồng bộ các models (tạo bảng nếu chưa tồn tại)
    await sequelize.sync({ force: false });  // force: false nghĩa là không xóa bảng cũ
    console.log('Cơ sở dữ liệu đã được đồng bộ!');
  } catch (error) {
    console.error('Không thể kết nối đến MySQL:', error);
  }
};

syncDatabase();
