<template>
    <div class="comment-list-container">
      <div v-if="isLoading" class="loading-comments">Loading comments...</div>
      <div v-else-if="hasError" class="error-comments">
         Error loading comments. Please try again later.
         </div>
      <div v-else-if="comments && comments.length > 0" class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <img :src="comment.authorAvatarUrl || defaultAvatar" alt="Avatar" class="comment-avatar">
          <div class="comment-content">
            <span class="comment-author">{{ comment.authorUsername }}</span>
            <span class="comment-text">{{ comment.text }}</span>
            <span class="comment-time">{{ timeAgo(comment.createdAt) }}</span>
          </div>
          </div>
      </div>
      <div v-else class="no-comments">
        Be the first to comment!
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  
  const props = defineProps({
    postId: {
      type: String,
      required: true,
    },
  });
  
  const store = useStore();
  
  // --- Lấy state và getters từ module 'comments' ---
  const comments = computed(() => store.getters['comments/getCommentsForPost'](props.postId));
  const isLoading = computed(() => store.getters['comments/isLoading']);
  const hasError = computed(() => store.getters['comments/hasError']);
  // const error = computed(() => store.state.comments.error); // Lấy chi tiết lỗi nếu cần
  
  // Placeholder avatar mặc định
  const defaultAvatar = 'https://via.placeholder.com/32x32?text=?';
  
  // Hàm tính thời gian tương đối (có thể chuyển vào utils)
  const timeAgo = (dateString) => {
      if (!dateString) return ''; const date = new Date(dateString); const seconds = Math.floor((new Date() - date) / 1000); let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + "y"; interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + "mo"; interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + "d"; interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + "h"; interval = seconds / 60; if (interval > 1) return Math.floor(interval) + "m"; return Math.floor(seconds) + "s";
  };
  
  
  // --- Fetch comments khi component mount hoặc postId thay đổi ---
  const fetchCommentsData = () => {
      if (props.postId) {
          console.log(`Workspaceing comments for postId: ${props.postId}`);
          store.dispatch('comments/fetchComments', props.postId);
      }
  }
  
  onMounted(fetchCommentsData);
  
  // Theo dõi nếu postId thay đổi (ví dụ khi xem post khác trong cùng component?)
  watch(() => props.postId, (newPostId) => {
      fetchCommentsData();
  });
  
  </script>
  
  <style scoped>
  .comment-list-container {
    margin-top: 1rem;
    font-size: 0.9em; /* Giảm kích thước chữ comment một chút */
  }
  
  .loading-comments, .error-comments, .no-comments {
    color: #8e8e8e;
    text-align: center;
    padding: 1rem 0;
    font-style: italic;
  }
  .error-comments {
     color: #dc3545;
     font-style: normal;
  }
  
  .comment-item {
    display: flex;
    margin-bottom: 0.8rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid #efefef; /* Ngăn cách nhẹ giữa các comment */
  }
  .comment-item:last-child {
     border-bottom: none;
     margin-bottom: 0;
     padding-bottom: 0;
  }
  
  .comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
    flex-shrink: 0; /* Không co lại */
    object-fit: cover;
    background-color: #eee;
  }
  
  .comment-content {
    flex-grow: 1; /* Chiếm phần còn lại */
    line-height: 1.4;
  }
  
  .comment-author {
    font-weight: 600;
    margin-right: 5px;
    color: #262626;
  }
  
  .comment-text {
    /* Style cho nội dung comment */
     color: #444;
  }
  
  .comment-time {
    display: block; /* Xuống dòng riêng */
    font-size: 0.8em;
    color: #aaa;
    margin-top: 3px;
  }
  </style>