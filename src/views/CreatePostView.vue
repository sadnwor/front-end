<template>
    <div class="create-post-view">
      <h2>Create New Post</h2>
      <CreatePostForm />
    </div>
  </template>
  
  <script setup>
  // Import component form
  import CreatePostForm from '@/components/CreatePostForm.vue';
  </script>
  
  <style scoped>
  .create-post-view {
    max-width: 600px;
    margin: 1.5rem auto;
    padding: 1.5rem;
    background-color: #fff;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
  }
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 600;
    color: #262626;
  }
  </style>