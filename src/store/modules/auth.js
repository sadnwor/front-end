// src/store/modules/auth.js
import authService from '@/services/auth'; // Dùng service mô phỏng
import router from '@/router'; // Để điều hướng sau khi login/logout

const state = () => ({
  user: null,
  token: null, // Token mô phỏng
});

const getters = {
  isLoggedIn: (state) => !!state.token,
  currentUser: (state) => state.user,
};

const actions = {
  async login({ commit, dispatch }, credentials) {
    try {
      const { user, token } = await authService.login(credentials); // Gọi service mô phỏng
      commit('SET_AUTH', { user, token });
      // Quan trọng: Load profile user sau khi login thành công
      dispatch('user/fetchProfile', user.username, { root: true });
      router.push('/'); // Điều hướng về trang chủ
      return true;
    } catch (error) {
      console.error("Login failed:", error.message);
      commit('CLEAR_AUTH');
      // Xóa cả profile nếu login thất bại
      commit('user/CLEAR_PROFILE', null, { root: true });
      throw error; // Ném lỗi để component xử lý UI
    }
  },

  async register({ commit, dispatch }, userData) {
    try {
      const { user, token } = await authService.register(userData); // Gọi service mô phỏng
      commit('SET_AUTH', { user, token });
       // Load profile (dù mới đăng ký nhưng để nhất quán)
      dispatch('user/fetchProfile', user.username, { root: true });
      router.push('/');
      return true;
    } catch (error) {
      console.error("Registration failed:", error.message);
      commit('CLEAR_AUTH');
      commit('user/CLEAR_PROFILE', null, { root: true });
      throw error;
    }
  },

  logout({ commit }) {
    authService.logout(); // Gọi service mô phỏng để xóa token giả
    commit('CLEAR_AUTH');
    commit('user/CLEAR_PROFILE', null, { root: true }); // Xóa cả profile data
    router.push('/login');
  },

   // Action để load lại state từ persisted state (nếu cần)
   async rehydrateAuth({ commit, dispatch, state }) {
      if (state.token && state.user?.username) {
         // Nếu có token và user trong state (từ persisted state), fetch lại profile
         try {
            await dispatch('user/fetchProfile', state.user.username, { root: true });
         } catch (error) {
            // Nếu fetch profile thất bại (ví dụ user bị xóa ở backend thật) thì logout
            console.error("Failed to rehydrate profile, logging out:", error);
            dispatch('logout');
         }
      } else if (state.token || state.user) {
         // Nếu state không nhất quán (có token mà ko có user hoặc ngược lại) -> logout
         console.warn("Inconsistent auth state during rehydration, logging out.");
         dispatch('logout');
      }
   }
};

const mutations = {
  SET_AUTH(state, { user, token }) {
    state.user = user;
    state.token = token;
  },
  CLEAR_AUTH(state) {
    state.user = null;
    state.token = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};