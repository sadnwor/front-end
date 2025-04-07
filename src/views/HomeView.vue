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
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import PostCard from '@/components/PostCard.vue';
  
  const store = useStore();
  
  const posts = computed(() => store.getters['posts/allPosts']);
  const isLoading = computed(() => store.getters['posts/isLoading']);
  
  onMounted(() => {
    store.dispatch('posts/fetchPosts');
  });
  
  </script>
  
  <style scoped>
  .home-view {
    max-width: 600px;
    margin: 1.5rem auto; 
    padding: 0 10px;
  }
  
  h1 {
     margin-bottom: 1.5rem;
     border-bottom: 1px solid #eee;
     padding-bottom: 0.5rem;
     text-align: center;
     font-weight: 600;
     color: #333;
  }
  
  .loading-message, .no-posts {
     text-align: center;
     margin-top: 3rem;
     color: #8e8e8e; 
     font-style: italic;
  }
  .no-posts p {
     margin-bottom: 1rem;
  }
  
  .post-card-link {
    text-decoration: none;
    color: inherit; 
    display: block;
    margin-bottom: 1.5rem;
  }
  .post-card-link:last-child {
     margin-bottom: 0;
  }
  
  </style>