<template>
    <div class="post-card">
      <div class="post-header">
        <router-link :to="{ name: 'profile' }" class="author-link">
          <img :src="post.authorAvatarUrl || defaultAvatar" alt="Author Avatar" class="author-avatar">
          <span class="author-username">{{ post.authorUsername }}</span>
        </router-link>
        <span class="post-time">{{ timeAgo(post.createdAt) }}</span>
      </div>
  
      <router-link :to="{ name: 'postDetail', params: { id: post.id } }" class="post-content-link">
        <div v-if="post.imageUrl" class="post-image-container">
          <img :src="post.imageUrl" alt="Post image" class="post-image">
        </div>
        <div class="post-text-content">
          <p>{{ post.content }}</p>
        </div>
      </router-link>
  
      <div class="post-actions">
        <button
          class="action-btn like-btn"
          :class="{ 'liked': isLikedByCurrentUser }"
          @click.prevent="toggleLike"
        >
          <i :class="isLikedByCurrentUser ? 'fas fa-heart' : 'far fa-heart'"></i>
          <span>{{ likeCount }}</span> </button>
        <router-link :to="{ name: 'postDetail', params: { id: post.id }, hash: '#comments' }" class="action-btn comment-btn">
           <i class="far fa-comment"></i> Comments
        </router-link>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed } from 'vue';
  import { useStore } from 'vuex'; // <-- Import useStore
  
  const props = defineProps({
    post: {
      type: Object,
      required: true
    }
  });
  
  const store = useStore(); // <-- Khởi tạo store
  
  // --- Lấy thông tin người dùng hiện tại ---
  const currentUser = computed(() => store.getters['auth/currentUser']);
  
  // --- Tính toán trạng thái và số lượt thích ---
  const likeCount = computed(() => props.post.likedBy?.length || 0);
  
  const isLikedByCurrentUser = computed(() => {
    if (!currentUser.value || !Array.isArray(props.post.likedBy)) {
      return false;
    }
    // Kiểm tra xem username có trong mảng likedBy không
    return props.post.likedBy.includes(currentUser.value.username);
  });
  
  // Placeholder avatar (giữ nguyên)
  const defaultAvatar = 'https://via.placeholder.com/40x40?text=?';
  
  // timeAgo (giữ nguyên)
  const timeAgo = (dateString) => { /* ... */
      if (!dateString) return ''; const date = new Date(dateString); const seconds = Math.floor((new Date() - date) / 1000); let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + "y ago"; interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + "mo ago"; interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + "d ago"; interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + "h ago"; interval = seconds / 60; if (interval > 1) return Math.floor(interval) + "m ago"; return Math.floor(seconds) + "s ago";
  };
  
  
  // --- Hàm xử lý khi nhấn nút Like/Unlike ---
  const toggleLike = () => {
    if (!currentUser.value) {
      console.warn("User must be logged in to like posts.");
      // Có thể hiện thông báo yêu cầu đăng nhập
      return;
    }
  
    const postId = props.post.id;
    if (isLikedByCurrentUser.value) {
      // Nếu đã thích -> gọi action unlike
      store.dispatch('posts/unlikePost', postId);
    } else {
      // Nếu chưa thích -> gọi action like
      store.dispatch('posts/likePost', postId);
    }
    // Không cần chờ await vì Vuex sẽ tự cập nhật state và component sẽ render lại
    // Trạng thái loading cho nút like có thể thêm sau nếu muốn phức tạp hơn
  };
  
  </script>
  
  <style scoped>
  /* ... (các style .post-card, .post-header, .author-link, ... giữ nguyên) ... */
  .post-card { background-color: #fff; border: 1px solid #dbdbdb; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .post-header { display: flex; align-items: center; padding: 10px 15px; border-bottom: 1px solid #efefef; }
  .author-link { display: flex; align-items: center; text-decoration: none; color: inherit; flex-grow: 1; }
  .author-avatar { width: 32px; height: 32px; border-radius: 50%; margin-right: 10px; border: 1px solid #eee; object-fit: cover; }
  .author-username { font-weight: 600; font-size: 0.9em; color: #262626; }
  .author-username:hover { text-decoration: underline; }
  .post-time { font-size: 0.75em; color: #8e8e8e; }
  .post-content-link { text-decoration: none; color: inherit; display: block; }
  .post-image-container { overflow: hidden; background-color: #fafafa; }
  .post-image { display: block; width: 100%; height: auto; object-fit: cover; }
  .post-text-content { padding: 10px 15px; font-size: 0.9em; line-height: 1.5; color: #262626; }
  .post-text-content p { margin: 0; }
  .post-actions { padding: 8px 15px; display: flex; gap: 15px; border-top: 1px solid #efefef; }
  
  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    font-size: 0.85em;
    display: flex;
    align-items: center;
    gap: 6px; /* Tăng khoảng cách icon và text */
    color: #262626; /* Màu nút mặc định */
  }
  .action-btn i {
    font-size: 1.4em; /* Tăng kích thước icon */
    line-height: 1; /* Căn chỉnh icon tốt hơn */
  }
  
  /* Style cho nút Like khi đã thích */
  .like-btn.liked i {
    color: red; /* Màu đỏ cho trái tim đã thích */
    font-weight: bold; /* Có thể dùng icon solid (fas) thay vì chỉ đổi màu */
  }
  .like-btn.liked {
     color: red; /* Đổi cả màu text nếu muốn */
  }
  
  /* Style cho nút comment (là link) */
  .comment-btn {
     text-decoration: none;
     color: #262626;
  }
  
  </style>