const FAKE_LATENCY_GET = 400;
const FAKE_LATENCY_CREATE = 700;
const FAKE_LATENCY_LIKE = 200;
const POSTS_STORAGE_KEY = 'vue_posts_db';

// --- Dữ liệu Post mẫu (Thêm commentCount) ---
const initialPosts = [
    {
      id: 'p1700000000001',
      authorUsername: 'userA',
      authorAvatarUrl: null,
      content: 'Chào buổi sáng! Hôm nay Hưng Yên nắng đẹp. #morning #hungyen',
      imageUrl: 'https://via.placeholder.com/600x400?text=Post+Image+1',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      likedBy: ['userB', 'userC', 'caohao'],
      comments: [],
      commentCount: 2 // <-- Đã thêm/cập nhật commentCount
    },
    {
      id: 'p1700000000002',
      authorUsername: 'userB',
      authorAvatarUrl: null,
      content: 'Thưởng thức cà phê cuối tuần.',
      imageUrl: null,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likedBy: ['userA'],
      comments: [],
      commentCount: 1 // <-- Đã thêm/cập nhật commentCount
    },
     {
      id: 'p1700000000003',
      authorUsername: 'caohao',
      authorAvatarUrl: null,
      content: 'Một góc làm việc quen thuộc.',
      imageUrl: 'https://via.placeholder.com/600x600?text=Workspace',
      createdAt: new Date().toISOString(),
      likedBy: [],
      comments: [],
      commentCount: 0 // <-- Đã thêm commentCount
    }
];

// --- Hàm đọc/ghi Posts từ localStorage (Cập nhật để đảm bảo có commentCount) ---
const getPostsFromStorage = () => {
  const postsJson = localStorage.getItem(POSTS_STORAGE_KEY);
  let posts = [];
  if (postsJson) { posts = JSON.parse(postsJson); }
  else { posts = initialPosts; localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts)); }
  // Đảm bảo mọi post đều có các trường cần thiết
  posts.forEach(post => {
    if (!Array.isArray(post.likedBy)) { post.likedBy = []; }
    if (!Array.isArray(post.comments)) { post.comments = []; }
    // Đảm bảo có commentCount, nếu không thì khởi tạo dựa trên comments (chỉ chạy lần đầu)
    if (typeof post.commentCount !== 'number') {
        post.commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
    }
  });
  return posts;
};

const savePostsToStorage = (posts) => { localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts)); };


// --- Hàm getPosts và getPostById (giữ nguyên logic) ---
const getPosts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const posts = getPostsFromStorage();
            posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            resolve([...posts]);
        }, FAKE_LATENCY_GET);
    });
};
const getPostById = (postId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const posts = getPostsFromStorage();
            const post = posts.find(p => p.id === postId);
            if (post) { resolve({ ...post }); } // Trả về likedBy
            else { reject(new Error('Post not found')); }
        }, FAKE_LATENCY_GET - 100);
    });
};


// --- Hàm createPost (Cập nhật để khởi tạo likedBy) ---
// --- Hàm createPost (Thêm commentCount) ---
const createPost = (postData) => {
  return new Promise((resolve, reject) => {
    const processAndSave = (imageUrlDataUrl = null) => {
      try {
        const newPost = {
          id: 'p' + Date.now() + Math.floor(Math.random() * 1000),
          authorUsername: postData.authorUsername,
          authorAvatarUrl: postData.authorAvatarUrl,
          content: postData.content,
          imageUrl: imageUrlDataUrl,
          createdAt: new Date().toISOString(),
          likedBy: [],
          comments: [],
          commentCount: 0 // <-- Khởi tạo commentCount là 0
        };
        const posts = getPostsFromStorage();
        posts.unshift(newPost);
        savePostsToStorage(posts);
        resolve({ ...newPost });
      } catch (saveError) { reject(new Error('Failed to save the post locally.')); }
    };
    setTimeout(() => { /* ... logic đọc ảnh giữ nguyên ... */
        if (postData.imageFile && postData.imageFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => processAndSave(event.target.result);
            reader.onerror = () => reject(new Error('Failed to read image file.'));
            reader.readAsDataURL(postData.imageFile);
        } else {
            processAndSave(null);
        }
    }, FAKE_LATENCY_CREATE);
  });
};

// --- HÀM MỚI: Thích bài viết ---
const likePost = (postId, username) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const posts = getPostsFromStorage();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          const post = posts[postIndex];
          // Đảm bảo likedBy là một mảng
          if (!Array.isArray(post.likedBy)) {
              post.likedBy = [];
          }
          // Thêm username vào nếu chưa có
          if (!post.likedBy.includes(username)) {
            post.likedBy.push(username);
            posts[postIndex] = post; // Cập nhật lại post trong mảng
            savePostsToStorage(posts);
          }
          resolve({ ...post }); // Trả về post đã cập nhật (quan trọng)
        } else {
          reject(new Error('Post not found to like.'));
        }
      } catch (error) {
        reject(new Error('Failed to process like action.'));
      }
    }, FAKE_LATENCY_LIKE);
  });
};

// --- HÀM MỚI: Bỏ thích bài viết ---
const unlikePost = (postId, username) => {
   return new Promise((resolve, reject) => {
    setTimeout(() => {
       try {
        const posts = getPostsFromStorage();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
           const post = posts[postIndex];
           if (Array.isArray(post.likedBy)) {
               // Lọc bỏ username ra khỏi mảng
               post.likedBy = post.likedBy.filter(u => u !== username);
               posts[postIndex] = post; // Cập nhật lại post
               savePostsToStorage(posts);
           }
           resolve({ ...post }); // Trả về post đã cập nhật (quan trọng)
        } else {
           reject(new Error('Post not found to unlike.'));
        }
       } catch (error) {
           reject(new Error('Failed to process unlike action.'));
       }
    }, FAKE_LATENCY_LIKE);
  });
};


export default {
  getPosts,
  getPostById,
  createPost,
  likePost,     // <-- Export hàm mới
  unlikePost,   // <-- Export hàm mới
};