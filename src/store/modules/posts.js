import postsService from "@/services/posts";

const state = () => ({
  posts: [],
  currentPost: null,
  loading: false, 
  error: null,
});

const getters = {
  allPosts: (state) => state.posts,
  currentPostDetail: (state) => state.currentPost,
  isLoading: (state) => state.loading,
  hasError: (state) => !!state.error,
};

const actions = {
  async fetchPosts({ commit }) {
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
    throw new Error("User not logged in.");
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

  async createPost({ commit, rootState }, { content, imageFile }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    const authorUsername = rootState.auth.user?.username;
    const userProfile = rootState.user.profile;
    const authorAvatarUrl = userProfile?.avatarUrl || null; 

    console.log("[Action createPost] User profile state:", userProfile);
    console.log(
      "[Action createPost] Attempting to use authorAvatarUrl:",
      authorAvatarUrl
    );

    if (!authorUsername) {
      commit("SET_LOADING", false); 
      commit("SET_ERROR", "User not logged in.");
      console.error("User not logged in. Cannot create post.");
      throw new Error("User not logged in.");
    }

    try {
      const postData = {
        content,
        imageFile,
        authorUsername,
        authorAvatarUrl, 
      };
      console.log("[Action createPost] Calling service with data:", postData);
      const newPost = await postsService.createPost(postData);
      console.log("[Action createPost] Service returned new post:", newPost); 
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

  async likePost({ commit, rootState }, postId) {
    const username = rootState.auth.user?.username;
    if (!username) {
      console.error("Cannot like post: User not logged in.");
      return;
    }
    try {
      const updatedPost = await postsService.likePost(postId, username);
      commit("UPDATE_POST", updatedPost);
    } catch (error) {
      console.error(`Error liking post ${postId}:`, error);
    } finally {
    }
  },

  async unlikePost({ commit, rootState }, postId) {
    const username = rootState.auth.user?.username;
    if (!username) {
      console.error("Cannot unlike post: User not logged in.");
      return;
    }
    try {
      const updatedPost = await postsService.unlikePost(postId, username);
      commit("UPDATE_POST", updatedPost);
    } catch (error) {
      console.error(`Error unliking post ${postId}:`, error);
    } finally {
    }
  },
};

const mutations = {
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

  UPDATE_POST(state, updatedPost) {
    const index = state.posts.findIndex((p) => p.id === updatedPost.id);
    if (index !== -1) {
      state.posts.splice(index, 1, updatedPost);
    }

    if (state.currentPost && state.currentPost.id === updatedPost.id) {
      state.currentPost = { ...state.currentPost, ...updatedPost };

    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
