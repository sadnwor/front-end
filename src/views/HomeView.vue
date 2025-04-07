<template>
    <div class="home-view">
     <div v-if="isLoading" class="loading-message">Loading posts...</div>
      <div v-else-if="posts && posts.length > 0" class="post-feed">
        <router-link
          v-for="post in posts"
          :key="post.id"
          :to="{ name: 'postDetail', params: { id: post.id } }" class="post-card-link"
        >
           <PostCard :post="post" />
        </router-link>
      </div>
      <div v-else class="no-posts">
         <p>No posts yet. Be the first to create one!</p>
         </div>
    </div>
  </template>
  
  <script setup>
  // Import các thành phần cần thiết
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import PostCard from '@/components/PostCard.vue'; // Import component PostCard
  
  // Khởi tạo store
  const store = useStore();
  
  // Lấy danh sách posts và trạng thái loading từ Vuex store
  const posts = computed(() => store.getters['posts/allPosts']);
  const isLoading = computed(() => store.getters['posts/isLoading']);
  
  // Gọi action để fetch (lấy) danh sách posts khi component được tạo (mount)
  onMounted(() => {
    // Luôn fetch khi vào trang chủ để có dữ liệu mới nhất (có thể tối ưu sau)
    store.dispatch('posts/fetchPosts');
  });
  
  // Các hàm helper như formatDate, truncateContent không còn cần thiết ở đây
  // vì chúng nên được xử lý bên trong component PostCard.vue (nếu cần)
  
  </script>
  
  <style scoped>
  /* Style cho trang HomeView */
  .home-view {
    max-width: 600px; /* Giới hạn chiều rộng của feed */
    margin: 1.5rem auto; /* Căn giữa và tạo khoảng cách trên/dưới */
    padding: 0 10px; /* Padding nhỏ hai bên nếu chiều rộng bị giới hạn */
  }
  
  h1 {
     margin-bottom: 1.5rem;
     border-bottom: 1px solid #eee; /* Đường kẻ mờ dưới tiêu đề */
     padding-bottom: 0.5rem;
     text-align: center; /* Căn giữa tiêu đề */
     font-weight: 600;
     color: #333;
  }
  
  .loading-message, .no-posts {
     text-align: center;
     margin-top: 3rem;
     color: #8e8e8e; /* Màu xám nhạt */
     font-style: italic;
  }
  .no-posts p {
     margin-bottom: 1rem;
  }
  
  /* Style cho thẻ link bao quanh PostCard */
  .post-card-link {
    text-decoration: none; /* Bỏ gạch chân */
    color: inherit; /* Màu chữ kế thừa */
    display: block; /* Đảm bảo link chiếm cả khối */
    margin-bottom: 1.5rem; /* Tạo khoảng cách giữa các PostCard */
  }
  /* Bỏ margin-bottom cho PostCard cuối cùng nếu cần */
  .post-card-link:last-child {
     margin-bottom: 0;
  }
  
  </style>