// src/services/comments.js (Mô phỏng API Comments bằng localStorage)

const FAKE_LATENCY = 300;
const COMMENTS_STORAGE_KEY = 'vue_comments_db';

// --- Dữ liệu Comment mẫu (giữ nguyên) ---
const initialComments = {
    "p1700000000001": [
        { id: 'c1710000000001', postId: 'p1700000000001', authorUsername: 'userB', authorAvatarUrl: null, text: 'Đồng ý, cảnh đẹp thật!', createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString() },
        { id: 'c1710000000002', postId: 'p1700000000001', authorUsername: 'caohao', authorAvatarUrl: null, text: 'Mình cũng muốn đến đây :)', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() }
    ],
    "p1700000000002": [
         { id: 'c1710000000003', postId: 'p1700000000002', authorUsername: 'userA', authorAvatarUrl: null, text: 'Quán nào vậy bạn?', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() }
    ],
};

// --- Hàm đọc/ghi Comments từ localStorage (giữ nguyên) ---
const getCommentsFromStorage = () => {
  const commentsJson = localStorage.getItem(COMMENTS_STORAGE_KEY);
  if (commentsJson) { return JSON.parse(commentsJson); }
  else { localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(initialComments)); return initialComments; }
};

const saveCommentsToStorage = (commentsDb) => { localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(commentsDb)); };

// --- Hàm mới (hoặc import) để đọc/ghi posts DB ---
const POSTS_STORAGE_KEY_FOR_COUNT = 'vue_posts_db';
const getPostsDb = () => JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY_FOR_COUNT) || '[]');
const savePostsDb = (posts) => localStorage.setItem(POSTS_STORAGE_KEY_FOR_COUNT, JSON.stringify(posts));
// --- Kết thúc hàm helper ---

// getCommentsByPostId (giữ nguyên)
const getCommentsByPostId = (postId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const commentsDb = getCommentsFromStorage();
      const commentsForPost = commentsDb[postId] || [];
       commentsForPost.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      resolve([...commentsForPost]);
    }, FAKE_LATENCY);
  });
};

// --- Cập nhật hàm addComment để tăng commentCount ---
const addComment = (postId, commentData) => {
   return new Promise((resolve, reject) => {
    setTimeout(() => {
       try {
        // 1. Tạo comment mới
        const newComment = {
          id: 'c' + Date.now() + Math.floor(Math.random() * 1000),
          postId: postId,
          authorUsername: commentData.authorUsername,
          authorAvatarUrl: commentData.authorAvatarUrl,
          text: commentData.text,
          createdAt: new Date().toISOString(),
        };

        // 2. Lưu comment mới vào commentsDb
        const commentsDb = getCommentsFromStorage();
        if (!Array.isArray(commentsDb[postId])) {
          commentsDb[postId] = [];
        }
        commentsDb[postId].push(newComment);
        saveCommentsToStorage(commentsDb);

        // --- 3. CẬP NHẬT commentCount TRONG postsDb ---
        try {
            const posts = getPostsDb(); // Đọc postsDb
            const postIndex = posts.findIndex(p => p.id === postId); // Tìm post
            if (postIndex !== -1) {
                // Tăng commentCount lên 1
                posts[postIndex].commentCount = (Number(posts[postIndex].commentCount) || 0) + 1;
                savePostsDb(posts); // Lưu lại postsDb
                 console.log(`Incremented comment count for post ${postId} to ${posts[postIndex].commentCount}`);
            } else {
                 console.warn(`Post ${postId} not found in postsDb while trying to update comment count.`);
            }
        } catch (postDbError) {
             console.error("Error updating comment count in postsDb:", postDbError);
             // Không reject ở đây
        }
        // --- Kết thúc cập nhật commentCount ---

        resolve({ ...newComment }); // Vẫn trả về comment mới

       } catch (error) {
           console.error("Error adding comment:", error);
           reject(new Error('Failed to save comment locally.'));
       }
    }, FAKE_LATENCY + 100);
  });
};

export default {
  getCommentsByPostId,
  addComment,
};