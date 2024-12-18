import axios from 'axios';

export const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');  // Lấy token từ localStorage

  try {
    const response = await axios.get('http://localhost:5000/protected', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;  // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi hàm này
  } 
};
