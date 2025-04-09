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
    imageUrl: '/anh2.jpg',
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
  },
  {
    id: 'p1700000000005',
    authorUsername: 'userC',
    authorAvatarUrl: null,
    content: 'Hôm nay thử món bún cá cay Hải Phòng, ngon không tưởng!',
    imageUrl: '/bunca.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userA', 'userB'],
    comments: [],
    commentCount: 3
  },
  {
    id: 'p1700000000006',
    authorUsername: 'userD',
    authorAvatarUrl: './avadefaur.png',
    content: 'Trà hoa cúc giúp mình ngủ ngon hơn hẳn. Recommend mạnh! 🌼',
    imageUrl: '/trahoacuc.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userC'],
    comments: [],
    commentCount: 0
  },
  {
    id: 'p1700000000007',
    authorUsername: 'userE',
    authorAvatarUrl: null,
    content: 'Đã lâu lắm rồi mới có một buổi hoàng hôn đẹp đến thế.',
    imageUrl: '/hoanghon.jpg',
    createdAt: new Date().toISOString(),
    likedBy: [],
    comments: [],
    commentCount: 0
  },
  {
    id: 'p1700000000008',
    authorUsername: 'userF',
    authorAvatarUrl: null,
    content: 'Vintage outfit hôm nay nè mọi người 😎 #2hand #outfitcheck',
    imageUrl: '/outfit1.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userA', 'userB', 'userC'],
    comments: [],
    commentCount: 4
  },
  {
    id: 'p1700000000009',
    authorUsername: 'userG',
    authorAvatarUrl: null,
    content: 'Hôm nay đi chợ mua được mớ rau tươi cực kỳ rẻ!',
    imageUrl: null,
    createdAt: new Date().toISOString(),
    likedBy: ['userC'],
    comments: [],
    commentCount: 1
  },
  {
    id: 'p1700000000010',
    authorUsername: 'userH',
    authorAvatarUrl: null,
    content: 'Bạn đã thử detox với trà hoa cúc chưa?',
    imageUrl: '/detox.jpg',
    createdAt: new Date().toISOString(),
    likedBy: [],
    comments: [],
    commentCount: 0
  },
  {
    id: 'p1700000000011',
    authorUsername: 'userI',
    authorAvatarUrl: null,
    content: 'Check-in đầu tuần với năng lượng tích cực 💪',
    imageUrl: '/monday.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userA'],
    comments: [],
    commentCount: 1
  },
  {
    id: 'p1700000000012',
    authorUsername: 'userJ',
    authorAvatarUrl: null,
    content: 'Tối nay nên xem phim gì mọi người ơi?',
    imageUrl: null,
    createdAt: new Date().toISOString(),
    likedBy: ['userB'],
    comments: [],
    commentCount: 5
  },
  {
    id: 'p1700000000013',
    authorUsername: 'userA',
    authorAvatarUrl: './avadefaur.png',
    content: 'Chạy bộ mỗi sáng giúp mình khỏe hơn rất nhiều 🏃‍♂️',
    imageUrl: '/chaybo.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userD', 'userF'],
    comments: [],
    commentCount: 2
  },
  {
    id: 'p1700000000014',
    authorUsername: 'userB',
    authorAvatarUrl: null,
    content: 'Một tách cà phê đen và chút nhạc jazz là combo hoàn hảo.',
    imageUrl: '/caphe.jpg',
    createdAt: new Date().toISOString(),
    likedBy: [],
    comments: [],
    commentCount: 0
  },
  {
    id: 'p1700000000015',
    authorUsername: 'userC',
    authorAvatarUrl: null,
    content: 'Trà hoa cúc kèm mật ong – đáng thử thật sự!',
    imageUrl: '/combo.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userA'],
    comments: [],
    commentCount: 3
  },
  {
    id: 'p1700000000016',
    authorUsername: 'userD',
    authorAvatarUrl: null,
    content: 'Chúc cả nhà một buổi tối bình yên ✨',
    imageUrl: null,
    createdAt: new Date().toISOString(),
    likedBy: ['userE'],
    comments: [],
    commentCount: 1
  },
  {
    id: 'p1700000000017',
    authorUsername: 'userE',
    authorAvatarUrl: null,
    content: 'Trời đang mưa nhẹ, ai đó pha cho tớ ly trà nóng với 🌧️',
    imageUrl: '/tramua.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userA', 'userB'],
    comments: [],
    commentCount: 2
  },
  {
    id: 'p1700000000018',
    authorUsername: 'userF',
    authorAvatarUrl: null,
    content: 'Làm việc từ quán cafe có khi lại tập trung hơn ở nhà 😅',
    imageUrl: '/lamviec.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userG'],
    comments: [],
    commentCount: 2
  },
  {
    id: 'p1700000000019',
    authorUsername: 'userG',
    authorAvatarUrl: null,
    content: 'Đã thử mix đồ 2hand hôm nay, khá ổn áp đó chứ!',
    imageUrl: '/2handmix.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userA', 'userB', 'userC'],
    comments: [],
    commentCount: 5
  },
  {
    id: 'p1700000000020',
    authorUsername: 'caohao',
    authorAvatarUrl: null,
    content: 'Ngồi đọc sách bên cửa sổ, nghe mưa rơi rả rích. Thật chill.',
    imageUrl: null,
    createdAt: new Date().toISOString(),
    likedBy: [],
    comments: [],
    commentCount: 0
  },
  {
    id: 'p1700000000021',
    authorUsername: 'userH',
    authorAvatarUrl: null,
    content: 'Tập gym 30 phút mỗi ngày là thói quen mình đang xây dựng.',
    imageUrl: '/gym.jpg',
    createdAt: new Date().toISOString(),
    likedBy: ['userD'],
    comments: [],
    commentCount: 2
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
