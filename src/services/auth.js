// src/services/auth.js (Mô phỏng API bằng localStorage)

const FAKE_LATENCY = 500; // Giả lập độ trễ mạng (ms)
const USER_STORAGE_KEY = 'vue_users_db'; // Key cho localStorage
const TOKEN_KEY = 'vue_auth_token';

// Hàm lấy danh sách users từ localStorage
const getUsers = () => {
  const users = localStorage.getItem(USER_STORAGE_KEY);
  return users ? JSON.parse(users) : {}; // Dạng { username: { password, backgroundImageUrl } }
};

// Hàm lưu users vào localStorage
const saveUsers = (users) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
};

// --- Các hàm mô phỏng API ---

const login = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const userRecord = users[credentials.username];

      if (userRecord && userRecord.password === credentials.password) {
        // Tạo token giả
        const fakeToken = `fake_token_for_${credentials.username}_${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, fakeToken); // Lưu token giả
        resolve({
          user: { username: credentials.username }, // Chỉ trả về username
          token: fakeToken,
        });
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, FAKE_LATENCY);
  });
};

const register = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      if (users[userData.username]) {
        reject(new Error('Username already exists'));
      } else {
        users[userData.username] = {
          password: userData.password,
          backgroundImageUrl: '', // Ảnh nền mặc định rỗng
        };
        saveUsers(users);

        // Tự động đăng nhập sau khi đăng ký
        const fakeToken = `fake_token_for_${userData.username}_${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, fakeToken);
        resolve({
          user: { username: userData.username },
          token: fakeToken,
        });
      }
    }, FAKE_LATENCY);
  });
};

const logout = () => {
   // Chỉ cần xóa token giả khỏi localStorage là đủ cho mô phỏng
  localStorage.removeItem(TOKEN_KEY);
   // Không cần trả về promise vì localStorage là đồng bộ
};

export default {
  login,
  register,
  logout,
  // Hàm helper có thể thêm nếu cần, ví dụ: getToken
  getToken: () => localStorage.getItem(TOKEN_KEY),
};