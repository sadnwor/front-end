<template>
    <div class="profile-view">
      <h2>My Profile</h2>
      <div v-if="isLoading">Loading profile...</div>
      <div v-else-if="userProfile">
        <p><strong>Username:</strong> {{ userProfile.username }}</p>
        <ProfileEditor />
      </div>
       <div v-else>Could not load profile information.</div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import ProfileEditor from '@/components/ProfileEditor.vue';
  
  const store = useStore();
  
  const userProfile = computed(() => store.getters['user/userProfile']);
  const isLoading = computed(() => store.getters['user/isLoading']);
  
  </script>
  
  <style scoped>
  .profile-view {
    padding: 2rem;
  }
  </style>