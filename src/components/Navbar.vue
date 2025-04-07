<template>
    <nav v-if="isLoggedIn" class="navbar">
      <router-link to="/" class="navbar-brand-link">
        <img
          src="../assets/img/logo.png"
          alt="MyNewsApp Logo"
          class="navbar-logo"
        >
      </router-link>
  
      <div class="navbar-links">
        <router-link to="/" title="Home">
          <i class="fas fa-home nav-icon"></i> </router-link>
        <router-link to="/notes" title="Notes">
           <i class="fas fa-user nav-icon"></i> </router-link>
  
        <router-link to="/post/new" class="create-post-link" title="Create New Post">
          <i class="fas fa-plus-square nav-icon"></i> </router-link>
        </div>
      <div class="navbar-user">
        <span>Hi, {{ username }}</span>
        <router-link to="/profile" class="avatar-link" title="Go to Profile">
          <img v-if="avatarUrl" :src="avatarUrl" alt="User Avatar" class="navbar-avatar">
          <div v-else class="navbar-avatar default-avatar">?</div>
        </router-link>
        <button @click="handleLogout">Logout</button>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  const store = useStore();
const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
const username = computed(() => store.getters['auth/currentUser']?.username || 'User');
const avatarUrl = computed(() => store.getters['user/avatarUrl']);

const handleLogout = () => {
  store.dispatch('auth/logout');
};
</script>
  
  <style scoped>
  .navbar-links {
   display: flex; /* Sắp xếp các icon ngang hàng */
   align-items: center;
   gap: 25px; /* Khoảng cách giữa các icon */
}
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 2rem; /* Giảm padding dọc một chút */
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  /* Style cho link chứa logo */
  .navbar-brand-link {
    display: flex; /* Để căn chỉnh logo và text (nếu có) */
    align-items: center;
    text-decoration: none; /* Bỏ gạch chân */
  }
  
  /* Style cho logo */
  .navbar-logo {
    height: 35px; /* Chiều cao logo - điều chỉnh cho phù hợp */
    width: auto; /* Chiều rộng tự động theo tỷ lệ */
    display: block; /* Loại bỏ khoảng trống thừa dưới ảnh */
  }
  
  /* Style cho text bên cạnh logo (nếu bạn muốn giữ lại) */
  /*
  .navbar-brand-text {
    font-weight: bold;
    font-size: 1.4em;
    color: #333;
    margin-left: 10px;
  }
  */
  
 
  .navbar-links a {
    margin: 0 15px;
    text-decoration: none;
    color: #555;
    font-weight: 500;
    transition: color 0.2s ease;
    padding-bottom: 4px; /* Thêm padding để border không nhảy layout */
    border-bottom: 2px solid transparent; /* Border trong suốt mặc định */
  }
  .navbar-links a {
   color: #262626; /* Màu icon mặc định */
   font-size: 1.4em; /* Kích thước icon */
   text-decoration: none;
   position: relative; /* Để tạo hiệu ứng active */
   padding: 5px; /* Tăng vùng bấm */
}
.navbar-links a.router-link-exact-active::after { /* Dấu chấm báo active */
   content: '';
   position: absolute;
   bottom: -5px; /* Vị trí dấu chấm */
   left: 50%;
   transform: translateX(-50%);
   width: 5px;
   height: 5px;
   background-color: #262626;
   border-radius: 50%;
}

  .navbar-user {
     display: flex;
     align-items: center;
  }
  .navbar-user span {
    margin-right: 10px;
    color: #333;
  }
  .navbar-user button {
    padding: 6px 12px;
    cursor: pointer;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.9em;
    transition: background-color 0.2s ease;
  }
  .navbar-user button:hover {
     background-color: #c82333;
  }
  
  .avatar-link {
     display: block;
     margin: 0 15px;
     cursor: pointer;
  }
  .navbar-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    font-weight: bold;
    color: #777;
    background-color: #eee;
  }
  </style>