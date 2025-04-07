// src/store/modules/user.js
import userService from '@/services/user';

const state = () => ({
  profile: null, // Sẽ chứa { username, backgroundImageUrl (nếu giữ lại), avatarUrl }
  loading: false,
  error: null,
});

const getters = {
  userProfile: (state) => state.profile,
  // backgroundImageUrl: (state) => state.profile?.backgroundImageUrl || '', // Giữ lại nếu vẫn dùng
  avatarUrl: (state) => state.profile?.avatarUrl || null, // Getter cho avatarUrl
  isLoading: (state) => state.loading,
};

const actions = {
  async fetchProfile({ commit }, username) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      // Service sẽ trả về cả avatarUrl
      const profileData = await userService.getUserProfile(username);
      commit('SET_PROFILE', profileData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      commit('SET_ERROR', error.message || 'Could not fetch profile');
      commit('CLEAR_PROFILE');
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Action mới để xử lý upload AVATAR file
  async uploadAndUpdateAvatar({ commit, state }, file) {
    if (!state.profile?.username) {
       const errorMsg = 'User profile not loaded. Cannot upload avatar.';
       commit('SET_ERROR', errorMsg);
       console.error(errorMsg);
       throw new Error(errorMsg);
    }
    if (!file) {
       const errorMsg = 'No file provided for avatar upload.';
       commit('SET_ERROR', errorMsg);
       console.error(errorMsg);
       throw new Error(errorMsg);
    }

    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      // Gọi service mới để upload avatar
      const updatedProfile = await userService.uploadAvatar(state.profile.username, file);
      commit('SET_PROFILE', updatedProfile); // Cập nhật profile với avatarUrl mới
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      const errorMsg = error.message || 'Failed to upload avatar';
      commit('SET_ERROR', errorMsg);
      throw new Error(errorMsg); // Ném lỗi để component bắt
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Action upload background cũ có thể xóa đi nếu không dùng nữa
  // async uploadAndUpdateBackground({ commit, state }, file) { ... }
};

const mutations = {
  SET_PROFILE(state, profileData) {
    // Đảm bảo cập nhật cả avatarUrl
    state.profile = { ...state.profile, ...profileData };
  },
  CLEAR_PROFILE(state) {
    state.profile = null;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};