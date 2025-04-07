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
  
  // Không cần gọi fetchProfile ở đây nữa vì đã gọi sau khi login/rehydrate
  // Nếu muốn đảm bảo load lại khi vào trang profile, có thể thêm:
  // import { onMounted } from 'vue';
  // onMounted(() => {
  //    if (!userProfile.value && store.getters['auth/currentUser']?.username) {
  //       store.dispatch('user/fetchProfile', store.getters['auth/currentUser'].username);
  //    }
  // });
  </script>
  
  <style scoped>
  .profile-view {
    padding: 2rem;
  }
  </style>