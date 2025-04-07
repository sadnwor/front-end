<template>
    <div class="profile-editor">
        <h3>Edit Profile Background</h3>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="form-group">
            <label for="background-file">Choose Background Image:</label>
            <input type="file" id="background-file" accept="image/*" @change="handleFileChange" />
            <p v-if="selectedFile" class="file-info">
                Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
            </p>
        </div>

        <div v-if="previewUrl" class="background-preview">
            <h4>New Background Preview:</h4>
            <div class="preview-box" :style="{ backgroundImage: `url(${previewUrl})` }"></div>
        </div>

        <button @click="uploadAndSaveBackground" :disabled="!selectedFile || loading">
            {{ loading ? 'Uploading...' : 'Save New Background' }}
        </button>

        <div class="background-preview current-background">
            <h4>Current Background:</h4>
            <p v-if="!currentBackgroundUrl && !isLoadingCurrent">No background set.</p>
            <p v-if="isLoadingCurrent">Loading current background...</p>
            <div v-if="currentBackgroundUrl" class="preview-box"
                :style="{ backgroundImage: `url(${currentBackgroundUrl})` }"></div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// --- State cho file và preview ---
const selectedFile = ref(null); // Lưu trữ đối tượng File đã chọn
const previewUrl = ref(null);   // Lưu URL tạm thời để xem trước ảnh

// --- State từ Vuex ---
const currentBackgroundUrl = computed(() => store.getters['user/backgroundImageUrl']);
const loading = computed(() => store.getters['user/isLoading']); // Loading cho việc upload/update
const isLoadingCurrent = computed(() => store.state.user.loading && !selectedFile.value); // Loading khi fetch profile ban đầu

// --- State cục bộ ---
const error = ref(null);
const successMessage = ref('');

// --- Xử lý khi người dùng chọn file ---
const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    error.value = null; // Reset lỗi cũ
    successMessage.value = ''; // Reset thông báo thành công cũ

    if (file && file.type.startsWith('image/')) {
        selectedFile.value = file;

        // Tạo URL xem trước (cần thu hồi sau)
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value); // Thu hồi URL cũ nếu có
        }
        previewUrl.value = URL.createObjectURL(file);

    } else {
        selectedFile.value = null;
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value);
        }
        previewUrl.value = null;
        if (file) { // Nếu có chọn file nhưng không phải ảnh
            error.value = "Please select a valid image file.";
        }
    }
};

// --- Xử lý khi nhấn nút Save ---
const uploadAndSaveBackground = async () => {
    if (!selectedFile.value) return;

    error.value = null;
    successMessage.value = '';

    try {
        // Gọi action mới trong store, truyền vào đối tượng File
        await store.dispatch('user/uploadAndUpdateAvatar', selectedFile.value);
        successMessage.value = 'Background updated successfully!';
        // Reset input và preview sau khi thành công
        selectedFile.value = null;
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value);
        }
        previewUrl.value = null;
        // Reset trường input file (hơi phức tạp, cách đơn giản là thêm key vào input để render lại)
        // Hoặc người dùng sẽ tự chọn lại file mới
        const fileInput = document.getElementById('background-file');
        if (fileInput) fileInput.value = ''; // Cố gắng reset input

    } catch (err) {
        error.value = store.state.user.error || 'Failed to upload or save background.';
        console.error("Upload error:", err);
    }
};

// --- Helper định dạng kích thước file ---
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// --- Dọn dẹp URL xem trước khi component bị hủy ---
onUnmounted(() => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }
});

// --- Đồng bộ previewUrl nếu ảnh nền hiện tại thay đổi từ store (ít xảy ra trừ khi có update từ nguồn khác) ---
// watch(currentBackgroundUrl, (newVal) => {
//   if (!selectedFile.value) { // Chỉ cập nhật nếu không có file nào đang được chọn để preview
//      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
//      previewUrl.value = null; // Hoặc gán newVal nếu muốn preview cả ảnh hiện tại?
//   }
// });

</script>

<style scoped>
.profile-editor {
    margin-top: 1rem;
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 5px;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
}

.form-group input[type="file"] {
    /* Style cho input file nếu cần */
    border: 1px solid #ccc;
    padding: 0.4rem;
    display: block;
    width: 100%;
    box-sizing: border-box;
}

.file-info {
    font-size: 0.85em;
    color: #555;
    margin-top: 0.5rem;
}

button {
    padding: 0.7rem 1.5rem;
    cursor: pointer;
    margin-top: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
}

button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: #aaa;
}

.error-message {
    color: red;
    margin-bottom: 1rem;
}

.success-message {
    color: green;
    margin-bottom: 1rem;
}

.background-preview {
    margin-top: 1.5rem;
}

.preview-box {
    width: 100%;
    height: 150px;
    border: 1px dashed #ccc;
    background-color: #f8f8f8;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaa;
    font-style: italic;
    margin-top: 0.5rem;
}

.current-background {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.avatar-preview {
    margin-top: 1.5rem;
    text-align: center;
    /* Căn giữa preview */
}

.preview-image {
    display: inline-block;
    /* Để căn giữa hoạt động */
    width: 100px;
    /* Kích thước avatar preview */
    height: 100px;
    border-radius: 50%;
    /* Bo tròn avatar */
    border: 2px solid #ccc;
    object-fit: cover;
    /* Đảm bảo ảnh vừa khung và không bị méo */
    background-color: #f0f0f0;
    /* Nền nếu ảnh chưa load */
    margin-top: 0.5rem;
}
</style>