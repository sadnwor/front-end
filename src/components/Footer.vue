<template>
    <footer class="app-footer">
      <p>&copy; {{ currentYear }} My News App. All rights reserved.</p>
      </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  const currentYear = computed(() => new Date().getFullYear());
  </script>
  
  <style scoped>
  .app-footer {
    text-align: center;
    padding: 1.5rem 1rem;
    margin-top: 2rem; /* Khoảng cách với nội dung phía trên */
    background-color: #f8f9fa; /* Màu nền nhạt */
    border-top: 1px solid #e9ecef;
    color: #6c757d; /* Màu chữ xám */
    font-size: 0.9em;
  }
  </style>