<template>
    <form @submit.prevent="submitComment" class="add-comment-form">
      <div class="form-group">
        <input
          type="text"
          v-model="commentText"
          placeholder="Add a comment..."
          required
          class="comment-input"
          :disabled="isSubmitting"
        />
        <button type="submit" class="submit-btn" :disabled="isSubmitting || !commentText.trim()">
          {{ isSubmitting ? 'Posting...' : 'Post' }}
        </button>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  import { useStore } from 'vuex';
  
  const props = defineProps({
    postId: {
      type: String,
      required: true,
    },
  });
  
  const store = useStore();
  const commentText = ref('');
  const isSubmitting = ref(false);
  const error = ref(null);
  
  const submitComment = async () => {
    if (!commentText.value.trim()) {
      error.value = 'Comment cannot be empty.';
      return;
    }
  
    isSubmitting.value = true;
    error.value = null;
  
    try {
      // Gọi action addComment từ module comments
      await store.dispatch('comments/addComment', {
        postId: props.postId,
        text: commentText.value,
      });
  
      // Nếu thành công, xóa nội dung input
      commentText.value = '';
  
    } catch (err) {
      console.error("Error submitting comment:", err);
      error.value = err.message || 'Failed to post comment. Please try again.';
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
  
  <style scoped>
  .add-comment-form {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #efefef; /* Ngăn cách với danh sách comment */
  }
  
  .form-group {
    display: flex; /* Sắp xếp input và button trên cùng hàng */
    align-items: center; /* Căn giữa theo chiều dọc */
    gap: 10px; /* Khoảng cách giữa input và button */
  }
  
  .comment-input {
    flex-grow: 1; /* Input chiếm phần lớn không gian */
    padding: 8px 12px;
    border: 1px solid #dbdbdb;
    border-radius: 15px; /* Bo tròn nhiều hơn */
    font-size: 0.9em;
    outline: none; /* Bỏ outline khi focus */
    line-height: 1.4;
  }
  .comment-input:focus {
     border-color: #a0a0a0;
  }
  
  .submit-btn {
    background: none;
    border: none;
    color: #007bff; /* Màu xanh dương cho nút Post */
    font-weight: 600;
    cursor: pointer;
    padding: 8px;
    font-size: 0.9em;
    flex-shrink: 0; /* Không co lại */
    transition: color 0.2s ease;
  }
  
  .submit-btn:disabled {
    color: #b3d7ff; /* Màu nhạt hơn khi bị disable */
    cursor: not-allowed;
  }
  .submit-btn:hover:not(:disabled) {
     color: #0056b3;
  }
  
  .error-message {
    color: red;
    font-size: 0.8em;
    margin-top: 5px;
    /* text-align: center; */ /* Hoặc căn lề trái */
  }
  </style>