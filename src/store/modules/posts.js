// src/store/modules/posts.js
import postsService from "@/services/posts";

const state = () => ({
  posts: [],
  currentPost: null,
  loading: false, // Chung cho fetch, có thể thêm loading riêng cho like/comment sau
  error: null,
});

const getters = {
  allPosts: (state) => state.posts,
  currentPostDetail: (state) => state.currentPost,
  isLoading: (state) => state.loading,
  hasError: (state) => !!state.error,
};

const actions = {
  // --- fetchPosts, fetchPostDetails, createPost giữ nguyên ---
  async fetchPosts({ commit }) {
    /* ... */
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const posts = await postsService.getPosts();
      commit("SET_POSTS", posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      commit("SET_ERROR", error.message || "Failed to fetch posts");
      commit("SET_POSTS", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async fetchPostDetails({ commit }, postId) {
    /* ... */
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    commit("SET_CURRENT_POST", null);
    try {
      const post = await postsService.getPostById(postId);
      commit("SET_CURRENT_POST", post);
    } catch (error) {
      console.error("Error fetching post details:", error);
      commit("SET_ERROR", error.message || "Failed to fetch post details");
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async createPost({ commit, rootState }, { content, imageFile }) {
    /* ... */
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    const authorUsername = rootState.auth.user?.username;
    const authorAvatarUrl = rootState.user.profile?.avatarUrl;
    if (!authorUsername) {
      /* ... error handling ... */ throw new Error("User not logged in.");
    }
    try {
      const postData = { content, imageFile, authorUsername, authorAvatarUrl };
      const newPost = await postsService.createPost(postData);
      commit("ADD_POST", newPost);
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      commit("SET_ERROR", error.message || "Failed to create post");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // src/store/modules/posts.js -> actions -> createPost
  async createPost({ commit, rootState }, { content, imageFile }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    const authorUsername = rootState.auth.user?.username;
    const userProfile = rootState.user.profile;
    // Lấy avatar URL, đảm bảo kiểm tra kỹ lưỡng hơn
    const authorAvatarUrl = userProfile?.avatarUrl || null; // Lấy URL hoặc null nếu không có

    // Log CỰC KỲ QUAN TRỌNG để debug
    console.log("[Action createPost] User profile state:", userProfile);
    console.log(
      "[Action createPost] Attempting to use authorAvatarUrl:",
      authorAvatarUrl
    ); // Xem giá trị này là gì

    if (!authorUsername) {
      commit("SET_LOADING", false); // Nhớ set loading false khi lỗi
      commit("SET_ERROR", "User not logged in.");
      console.error("User not logged in. Cannot create post.");
      throw new Error("User not logged in.");
    }

    try {
      const postData = {
        content,
        imageFile,
        authorUsername,
        authorAvatarUrl, // Truyền giá trị đã lấy được (có thể là null)
      };
      console.log("[Action createPost] Calling service with data:", postData);
      const newPost = await postsService.createPost(postData);
      console.log("[Action createPost] Service returned new post:", newPost); // Xem avatarUrl trong post trả về
      commit("ADD_POST", newPost);
      return newPost;
    } catch (error) {
      console.error("[Action createPost] Error creating post:", error);
      commit("SET_ERROR", error.message || "Failed to create post");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // --- ACTION MỚI: Thích bài viết ---
  async likePost({ commit, rootState }, postId) {
    const username = rootState.auth.user?.username;
    if (!username) {
      console.error("Cannot like post: User not logged in.");
      // Có thể commit một lỗi hoặc không làm gì cả
      return; // Hoặc throw new Error('User not logged in');
    }
    // Có thể thêm trạng thái loading riêng cho nút like nếu muốn
    // commit('SET_LIKE_LOADING', { postId, loading: true });
    try {
      // Gọi service, truyền postId và username người dùng hiện tại
      const updatedPost = await postsService.likePost(postId, username);
      // Commit mutation để cập nhật post trong state
      commit("UPDATE_POST", updatedPost);
    } catch (error) {
      console.error(`Error liking post ${postId}:`, error);
      // Commit lỗi nếu cần thiết để hiển thị trên UI
      // commit('SET_ERROR', `Failed to like post: ${error.message}`);
    } finally {
      // commit('SET_LIKE_LOADING', { postId, loading: false });
    }
  },

  // --- ACTION MỚI: Bỏ thích bài viết ---
  async unlikePost({ commit, rootState }, postId) {
    const username = rootState.auth.user?.username;
    if (!username) {
      console.error("Cannot unlike post: User not logged in.");
      return;
    }
    // commit('SET_LIKE_LOADING', { postId, loading: true });
    try {
      const updatedPost = await postsService.unlikePost(postId, username);
      commit("UPDATE_POST", updatedPost);
    } catch (error) {
      console.error(`Error unliking post ${postId}:`, error);
      // commit('SET_ERROR', `Failed to unlike post: ${error.message}`);
    } finally {
      // commit('SET_LIKE_LOADING', { postId, loading: false });
    }
  },
};

const mutations = {
  // --- SET_POSTS, SET_CURRENT_POST, SET_LOADING, SET_ERROR, ADD_POST giữ nguyên ---
  SET_POSTS(state, posts) {
    state.posts = posts;
  },
  SET_CURRENT_POST(state, post) {
    state.currentPost = post;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_POST(state, newPost) {
    state.posts.unshift(newPost);
  },

  // --- MUTATION MỚI: Cập nhật một bài viết trong state ---
  UPDATE_POST(state, updatedPost) {
    // Cập nhật trong danh sách posts (trang chủ)
    const index = state.posts.findIndex((p) => p.id === updatedPost.id);
    if (index !== -1) {
      // Thay thế object cũ bằng object mới để đảm bảo tính reactive
      state.posts.splice(index, 1, updatedPost);
      // Hoặc nếu muốn giữ nguyên object gốc và chỉ cập nhật likedBy:
      // state.posts[index].likedBy = updatedPost.likedBy;
    }

    // Cập nhật trong currentPost (trang chi tiết) nếu nó đang được hiển thị
    if (state.currentPost && state.currentPost.id === updatedPost.id) {
      state.currentPost = { ...state.currentPost, ...updatedPost };
      // Hoặc nếu chỉ cập nhật likedBy:
      // state.currentPost.likedBy = updatedPost.likedBy;
    }
  },
  // Có thể thêm mutation SET_LIKE_LOADING nếu cần
  // SET_LIKE_LOADING(state, { postId, loading }) { ... }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
