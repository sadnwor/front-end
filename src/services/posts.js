const FAKE_LATENCY_GET = 400;
const FAKE_LATENCY_CREATE = 700;
const FAKE_LATENCY_LIKE = 200;
const POSTS_STORAGE_KEY = 'vue_posts_db';

const initialPosts = [
    {
      id: 'p1700000000001',
      authorUsername: 'userA',
      authorAvatarUrl: './avadefaur.png',
      content: 'Chào buổi sáng! Hôm nay Hưng Yên nắng đẹp. #morning #hungyen',
      imageUrl: '/run.jpg',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      likedBy: ['userB', 'userC', 'caohao'],
      comments: [],
      commentCount: 2
    },

    {
      id: 'p1700000000002',
      authorUsername: 'userB',
      authorAvatarUrl: null,
      content: 'Hôm nay trời mát mẻ, rất thích hợp để đi dạo.',
      imageUrl: null,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likedBy: ['userA'],
      comments: [],
      commentCount: 1
    },
 
    {
      id: 'p1700000000003',
      authorUsername: 'userB',
      authorAvatarUrl: null,
      content: 'Thưởng thức cà phê cuối tuần.',
      imageUrl: "/anh2.jpg",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likedBy: ['userA'],
      comments: [],
      commentCount: 1
    },
     {
      id: 'p1700000000004',
      authorUsername: 'caohao',
      authorAvatarUrl: null,
      content: 'Trời xanh, mây trắng, nắng vàng.',
      imageUrl: '/halan.jpg',
      createdAt: new Date().toISOString(),
      likedBy: [],
      comments: [],
      commentCount: 0 
    }
];

const getPostsFromStorage = () => {
  const postsJson = localStorage.getItem(POSTS_STORAGE_KEY);
  let posts = [];
  if (postsJson) { posts = JSON.parse(postsJson); }
  else { posts = initialPosts; localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts)); }
  posts.forEach(post => {
    if (!Array.isArray(post.likedBy)) { post.likedBy = []; }
    if (!Array.isArray(post.comments)) { post.comments = []; }
    if (typeof post.commentCount !== 'number') {
        post.commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
    }
  });
  return posts;
};

const savePostsToStorage = (posts) => { localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts)); };


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
            if (post) { resolve({ ...post }); } 
            else { reject(new Error('Post not found')); }
        }, FAKE_LATENCY_GET - 100);
    });
};

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
          commentCount: 0 
        };
        const posts = getPostsFromStorage();
        posts.unshift(newPost);
        savePostsToStorage(posts);
        resolve({ ...newPost });
      } catch (saveError) { reject(new Error('Failed to save the post locally.')); }
    };
    setTimeout(() => {
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

const likePost = (postId, username) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const posts = getPostsFromStorage();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          const post = posts[postIndex];
          if (!Array.isArray(post.likedBy)) {
              post.likedBy = [];
          }
          if (!post.likedBy.includes(username)) {
            post.likedBy.push(username);
            posts[postIndex] = post; 
            savePostsToStorage(posts);
          }
          resolve({ ...post }); 
        } else {
          reject(new Error('Post not found to like.'));
        }
      } catch (error) {
        reject(new Error('Failed to process like action.'));
      }
    }, FAKE_LATENCY_LIKE);
  });
};

const unlikePost = (postId, username) => {
   return new Promise((resolve, reject) => {
    setTimeout(() => {
       try {
        const posts = getPostsFromStorage();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
           const post = posts[postIndex];
           if (Array.isArray(post.likedBy)) {
               post.likedBy = post.likedBy.filter(u => u !== username);
               posts[postIndex] = post; 
               savePostsToStorage(posts);
           }
           resolve({ ...post }); 
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
  likePost,    
  unlikePost,  
};