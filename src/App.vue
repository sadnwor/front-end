<template>
  <div id="app-wrapper">
    <Navbar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
         <transition name="fade" mode="out-in">
           <component :is="Component" />
         </transition>
      </router-view>
    </main>
    <Footer /> </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue'; 
</script>

<style>
/* Import base styles */
@import '@/assets/base.css';
@import '@/assets/main.css'; 

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
  background-color: var(--color-background-soft, #f8f9fa); 
}

.main-content {
  flex-grow: 1; 
  padding: 0;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease; 
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>