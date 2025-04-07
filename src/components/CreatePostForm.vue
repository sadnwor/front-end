<template>
    <form @submit.prevent="submitPost" class="create-post-form">
      <div v-if="error" class="error-message">{{ error }}</div>
  
      <div class="form-group">
        <label for="post-content">What's on your mind?</label>
        <textarea
          id="post-content"
          v-model="content"
          rows="4"
          placeholder="Write your post content here..."
          required
        ></textarea>
      </div>
  
      <div class="form-group">
        <label for="post-image">Add an image (optional):</label>
        <input
          type="file"
          id="post-image"
          accept="image/*"
          @change="handleFileChange"
          ref="fileInputRef"
        />
      </div>
  
      <div v-if="previewUrl" class="image-preview">
        <p>Image Preview:</p>
        <img :src="previewUrl" alt="Image preview" class="preview-image" />
        <button type="button" @click="removeImage" class="remove-image-btn">
          Remove Image
        </button>
      </div>
  
      <button type="submit" :disabled="isSubmitting || !content.trim()">
        {{ isSubmitting ? 'Posting...' : 'Create Post' }}
      </button>
    </form>
  </template>
  
  <script setup>
  import { ref, onUnmounted } from 'vue';
  // Bỏ comment các import này
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  const store = useStore(); // <-- Khởi tạo store
  const router = useRouter(); // <-- Khởi tạo router
  
  const content = ref('');
  const selectedFile = ref(null);
  const previewUrl = ref(null);
  const fileInputRef = ref(null);
  const isSubmitting = ref(false);
  const error = ref(null);
  
  // handleFileChange (giữ nguyên)
  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    error.value = null; // Reset lỗi cũ
  
    if (file && file.type.startsWith('image/')) {
      selectedFile.value = file;
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
      }
      previewUrl.value = URL.createObjectURL(file);
    } else {
      if (file) {
          error.value = "Please select a valid image file.";
      }
      removeImage();
    }
  };
  
  // removeImage (giữ nguyên)
  const removeImage = () => {
    selectedFile.value = null;
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = null;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  };
  
  // --- CẬP NHẬT HOÀN CHỈNH HÀM submitPost ---
  const submitPost = async () => {
    if (!content.value.trim()) {
        error.value = "Post content cannot be empty.";
        return;
    }
    isSubmitting.value = true;
    error.value = null;
  
    // Bỏ comment và sử dụng logic dispatch Vuex
    try {
      // Gọi action Vuex để tạo post
      const newPost = await store.dispatch('posts/createPost', { // <-- Gọi action posts/createPost
        content: content.value,
        imageFile: selectedFile.value // Truyền file object (có thể là null)
      });
  
      // Reset form sau khi thành công
      content.value = '';
      removeImage();
  
      // Chuyển hướng về trang chủ
      router.push('/');
      // Hoặc chuyển đến chi tiết bài viết mới (nếu muốn):
      // router.push({ name: 'postDetail', params: { id: newPost.id } });
  
    } catch (err) {
      // Hiển thị lỗi từ action Vuex
      error.value = err.message || 'Failed to create post.';
      console.error("Create post error:", err);
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // onUnmounted (giữ nguyên)
  onUnmounted(() => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
  });
  </script>
  
  <style scoped>
  /* ... (style giữ nguyên) ... */
  .form-group { margin-bottom: 1.5rem; }
  .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
  textarea, input[type="file"] { width: 100%; padding: 0.75rem; border: 1px solid #dbdbdb; border-radius: 4px; font-size: 1em; box-sizing: border-box; line-height: 1.5; }
  textarea { resize: vertical; }
  input[type="file"] { padding: 0.5rem; line-height: normal; }
  .image-preview { margin-top: 1rem; margin-bottom: 1rem; border: 1px dashed #ccc; padding: 1rem; border-radius: 4px; text-align: center; }
  .image-preview p { margin-top: 0; margin-bottom: 0.5rem; font-size: 0.9em; color: #555; }
  .preview-image { max-width: 100%; max-height: 300px; display: block; margin: 0 auto 0.5rem auto; border-radius: 4px; }
  .remove-image-btn { background: none; border: none; color: #dc3545; cursor: pointer; font-size: 0.85em; text-decoration: underline; padding: 0; }
  button[type="submit"] { display: block; width: 100%; padding: 0.8rem 1.5rem; background-color: #007bff; color: white; border: none; border-radius: 4px; font-size: 1.1em; font-weight: 600; cursor: pointer; transition: background-color 0.2s ease; }
  button[type="submit"]:disabled { background-color: #a0cfff; cursor: not-allowed; }
  button[type="submit"]:hover:not(:disabled) { background-color: #0056b3; }
  .error-message { color: red; margin-bottom: 1rem; font-size: 0.9em; text-align: center; }
  </style>