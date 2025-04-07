// src/services/user.js (Mô phỏng API user bằng localStorage)

const FAKE_LATENCY_UPLOAD = 800;
const FAKE_LATENCY_GET = 300;
const USER_STORAGE_KEY = 'vue_users_db';

const getUsers = () => {
  const users = localStorage.getItem(USER_STORAGE_KEY);
  const parsedUsers = users ? JSON.parse(users) : {};
  // Đảm bảo cấu trúc user có avatarUrl
  Object.keys(parsedUsers).forEach(username => {
      if (!parsedUsers[username].hasOwnProperty('avatarUrl')) {
          parsedUsers[username].avatarUrl = null; // Khởi tạo nếu thiếu
      }
       if (!parsedUsers[username].hasOwnProperty('backgroundImageUrl')) {
          parsedUsers[username].backgroundImageUrl = null; // Khởi tạo nếu thiếu (nếu vẫn dùng)
      }
  });
  return parsedUsers;
};

const saveUsers = (users) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
};

const getUserProfile = (username) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const userRecord = users[username];
      if (userRecord) {
        resolve({ // Trả về đầy đủ thông tin profile
          username: username,
          avatarUrl: userRecord.avatarUrl || null, // Trả về avatarUrl
          backgroundImageUrl: userRecord.backgroundImageUrl || '', // Nếu vẫn dùng
        });
      } else {
        reject(new Error('User not found'));
      }
    }, FAKE_LATENCY_GET);
  });
};

// Hàm mới để "upload" AVATAR (đọc thành Data URL)
const uploadAvatar = (username, file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid file type provided for avatar.'));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target.result;

      setTimeout(() => { // Giả lập độ trễ mạng
        try {
          const users = getUsers();
          const userRecord = users[username];
          if (userRecord) {
            userRecord.avatarUrl = dataUrl; // Lưu Data URL vào avatarUrl
            users[username] = userRecord;
            saveUsers(users);
            // Trả về profile đã cập nhật
            resolve({
              username: username,
              avatarUrl: dataUrl,
              backgroundImageUrl: userRecord.backgroundImageUrl || '', // Nếu vẫn dùng
            });
          } else {
            reject(new Error('User not found during avatar save.'));
          }
        } catch (storageError) {
          console.error("LocalStorage save error (avatar):", storageError);
          reject(new Error('Failed to save avatar. Storage might be full.'));
        }
      }, FAKE_LATENCY_UPLOAD);
    };

    reader.onerror = (error) => {
      console.error("FileReader error (avatar):", error);
      reject(new Error('Failed to read the avatar image file.'));
    };

    reader.readAsDataURL(file);
  });
};

// Hàm upload background cũ có thể xóa đi
// const uploadProfileBackground = (username, file) => { ... }

export default {
  getUserProfile,
  uploadAvatar, // Xuất hàm mới
  // uploadProfileBackground, // Xóa hàm cũ nếu không dùng
};