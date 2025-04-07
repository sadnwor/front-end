// src/store/modules/comments.js
import commentsService from '@/services/comments';

const state = () => ({
  // Lưu comments dưới dạng object: { postId: [comment1, comment2], ... }
  commentsByPost: {},
  loading: false,
  error: null,
});

const getters = {
  // Lấy mảng comments cho một postId cụ thể
  getCommentsForPost: (state) => (postId) => {
    return state.commentsByPost[postId] || [];
  },
  isLoading: (state) => state.loading,
  hasError: (state) => !!state.error,
};

const actions = {
  // Lấy comments cho một bài viết
  async fetchComments({ commit }, postId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const comments = await commentsService.getCommentsByPostId(postId);
      commit('SET_COMMENTS_FOR_POST', { postId, comments });
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      commit('SET_ERROR', error.message || 'Failed to fetch comments');
      // Đảm bảo set mảng rỗng nếu lỗi để tránh lỗi ở component
      commit('SET_COMMENTS_FOR_POST', { postId, comments: [] });
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Thêm một comment mới
  async addComment({ commit, rootState }, { postId, text }) {
    const authorUsername = rootState.auth.user?.username;
    const userProfile = rootState.user.profile;
    // Lấy avatar URL, đảm bảo kiểm tra
    const authorAvatarUrl = userProfile?.avatarUrl || null;

    // Log CỰC KỲ QUAN TRỌNG để debug
    console.log('[Action addComment] User profile state:', userProfile);
    console.log('[Action addComment] Attempting to use authorAvatarUrl:', authorAvatarUrl); // Xem giá trị này là gì

    if (!authorUsername) {
        const errorMsg = 'User not logged in. Cannot add comment.';
        commit('SET_ERROR', errorMsg); // Có thể set lỗi ở state comments
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
     if (!text || !text.trim()) {
        const errorMsg = 'Comment text cannot be empty.';
        commit('SET_ERROR', errorMsg);
        console.error(errorMsg);
        throw new Error(errorMsg);
     }

    // Không set loading/error ở đây vì form sẽ tự xử lý
    // commit('SET_LOADING', true);
    // commit('SET_ERROR', null);
    try {
      const commentData = {
        text: text.trim(),
        authorUsername,
        authorAvatarUrl
      };
      console.log(`[Action addComment] Calling service for post ${postId} with data:`, commentData);
      const newComment = await commentsService.addComment(postId, commentData);
       console.log('[Action addComment] Service returned new comment:', newComment); // Xem avatarUrl trong comment trả về

      commit('ADD_COMMENT_TO_POST', { postId, newComment });
      return newComment;

    } catch (error) {
      console.error(`[Action addComment] Error adding comment to post ${postId}:`, error);
        throw error;
    } finally {
       // commit('SET_LOADING', false);
    }
  },
};


const mutations = {
  // Lưu trữ hoặc cập nhật mảng comments cho một postId
  SET_COMMENTS_FOR_POST(state, { postId, comments }) {
     // Dùng cách này để đảm bảo reactivity khi thêm key mới vào object
     state.commentsByPost = { ...state.commentsByPost, [postId]: comments };
     // Hoặc nếu dùng Vue 3: Vue.set(state.commentsByPost, postId, comments);
  },

  // Thêm một comment mới vào mảng của postId tương ứng
  ADD_COMMENT_TO_POST(state, { postId, newComment }) {
    // Đảm bảo mảng tồn tại trước khi push
    if (!Array.isArray(state.commentsByPost[postId])) {
        // state.commentsByPost[postId] = []; // Cách này có thể không reactive
        state.commentsByPost = { ...state.commentsByPost, [postId]: [] };
    }
    state.commentsByPost[postId].push(newComment);
  },

  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true, // Quan trọng!
  state,
  getters,
  actions,
  mutations,
};