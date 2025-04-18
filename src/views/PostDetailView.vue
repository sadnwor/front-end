<template>
    <div class="post-detail-view">
      <div v-if="isLoading" class="loading-message">Loading post...</div>
      <div v-else-if="post" class="post-detail-content">
        <PostCard :post="post" class="detail-postcard" />
  
        <div class="comments-section">
          <AddCommentForm :postId="post.id" />
  
          <CommentList :postId="post.id" />
  
        </div>
  
         <router-link to="/" class="back-link">&larr; Back to Feed</router-link>
  
      </div>
      <div v-else class="not-found-message">
        <h2>Post Not Found</h2>
        <p>Sorry, the post you are looking for does not exist or could not be loaded.</p>
         <router-link to="/" class="back-link">&larr; Back to Feed</router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import PostCard from '@/components/PostCard.vue';
  import CommentList from '@/components/CommentList.vue';
  import AddCommentForm from '@/components/AddCommentForm.vue';
  
  const store = useStore();
  const route = useRoute();
  const router = useRouter();
  
  const postId = computed(() => route.params.id);
  const post = computed(() => store.getters['posts/currentPostDetail']);
  const isLoading = computed(() => store.getters['posts/isLoading']);
  const error = computed(() => store.state.posts.error);
  
  const fetchDetails = (id) => {
    if (id) {
      store.dispatch('posts/fetchPostDetails', id);
    }
  };
  
  onMounted(() => {
    fetchDetails(postId.value);
  });
  
  watch(postId, (newId) => {
    fetchDetails(newId);
  });
  
  watch(error, (newError) => {
     if (newError && newError.includes('Post not found')) {
         console.warn("Post not found, consider redirecting.");
     }
  });
  
  </script>
  
  <style scoped>
  .post-detail-view {
    max-width: 600px;
    margin: 1.5rem auto;
  }
  
  .loading-message, .not-found-message {
    text-align: center;
    margin-top: 3rem;
    color: #8e8e8e;
  }
  .not-found-message h2 {
     margin-bottom: 1rem;
  }
  
  .post-detail-content {
    background-color: #fff;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
  }
  
  .detail-postcard.post-card {
    margin-bottom: 0;
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: none;
    border: none; 
  }
  
  .back-link {
    display: block;
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #007bff;
    text-decoration: none;
    font-size: 0.9em;
  }
  .back-link:hover {
    text-decoration: underline;
  }
  </style>