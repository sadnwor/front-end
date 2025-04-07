<template>
  <div class="my-posts-view">
    <div v-if="currentUserProfile" class="profile-header">
      <img :src="currentUserProfile.avatarUrl || defaultAvatar" alt="My Avatar" class="profile-avatar">
      <h1 class="profile-username">{{ currentUserProfile.username }}</h1>
      <p class="post-count">{{ myPosts.length }} {{ myPosts.length === 1 ? 'post' : 'posts' }}</p>
       <router-link to="/profile" class="edit-profile-btn">Edit Profile</router-link>
    </div>
     <div v-else class="loading-message">Loading profile...</div>

     <hr class="divider">

    <h2>My Posts</h2>
    <div v-if="isLoadingPosts" class="loading-message">Loading posts...</div>
    <div v-else-if="myPosts && myPosts.length > 0" class="my-posts-grid">
      <div v-for="post in myPosts" :key="post.id" class="my-post-item">
           <router-link :to="{ name: 'postDetail', params: { id: post.id } }">
                <img v-if="post.imageUrl" :src="post.imageUrl" :alt="'Post by ' + post.authorUsername" class="post-thumbnail">
               <div v-else class="post-thumbnail no-image">
                  <i class="fas fa-align-left"></i> </div>
               <div class="post-overlay">
                  <span><i class="fas fa-heart"></i> {{ post.likedBy?.length || 0 }}</span>
                  <span><i class="fas fa-comment"></i> {{ post.comments?.length || 0 }}</span>
               </div>
           </router-link>
       </div>
    </div>
    <div v-else class="no-posts">
      You haven't posted anything yet. <router-link to="/post/new">Create your first post!</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const currentUserProfile = computed(() => store.getters['user/userProfile']);
const currentUsername = computed(() => store.getters['auth/currentUser']?.username); 

const allPosts = computed(() => store.getters['posts/allPosts']);
const isLoadingPosts = computed(() => store.getters['posts/isLoading']);

const myPosts = computed(() => {
  if (!currentUsername.value || !Array.isArray(allPosts.value)) {
    return [];
  }
  return allPosts.value.filter(post => post.authorUsername === currentUsername.value);
});

const defaultAvatar = '../assets/img/default-avatar.png';

onMounted(() => {
  if (!allPosts.value || allPosts.value.length === 0) {
    store.dispatch('posts/fetchPosts');
  }
  if(!currentUserProfile.value && currentUsername.value) {
      store.dispatch('user/fetchProfile', currentUsername.value);
  }
});

</script>

<style scoped>
.my-posts-view {
  max-width: 900px;
  margin: 1.5rem auto;
  padding: 1.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #dbdbdb;
  gap: 20px; 
}

.profile-avatar {
  width: 80px; 
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
}

.profile-username {
  font-size: 1.8em;
  font-weight: 300; 
  margin: 0;
  flex-grow: 1; 
}
.post-count {
   font-size: 1em;
   color: #555;
   margin: 0 1rem;
}
.edit-profile-btn {
   padding: 6px 12px;
   border: 1px solid #dbdbdb;
   background-color: transparent;
   color: #262626;
   border-radius: 4px;
   font-weight: 600;
   font-size: 0.9em;
   cursor: pointer;
   text-decoration: none;
   transition: background-color 0.2s ease;
}
.edit-profile-btn:hover {
   background-color: #fafafa;
}

.divider {
  border: 0;
  height: 1px;
  background-color: #dbdbdb;
  margin: 2rem 0;
}

h2 {
  text-align: center;
  font-weight: 600;
  color: #8e8e8e; 
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2rem;
}

.loading-message, .no-posts {
  text-align: center;
  margin-top: 3rem;
  color: #8e8e8e;
}
.no-posts a {
   color: #007bff;
   text-decoration: none;
   font-weight: 600;
}
.no-posts a:hover {
   text-decoration: underline;
}

.my-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem; 
}

.my-post-item {
   position: relative; 
   aspect-ratio: 1 / 1; 
   background-color: #eee; 
   border-radius: 4px;
   overflow: hidden;
}
.my-post-item a {
   display: block;
   width: 100%;
   height: 100%;
}

.post-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.post-thumbnail.no-image {
   display: flex;
   justify-content: center;
   align-items: center;
   color: #ccc;
   font-size: 3em;
   background-color: #fafafa;
}

.post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  opacity: 0; 
  transition: opacity 0.2s ease;
  font-weight: 600;
  font-size: 1.1em;
}
.my-post-item a:hover .post-overlay {
  opacity: 1; 
}
.post-overlay span {
   display: flex;
   align-items: center;
   gap: 5px;
}
.post-overlay i {
   font-size: 0.9em;
}

</style>