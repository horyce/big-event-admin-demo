<script setup>
  import { userUploadAvatarService } from '@/api/user';
  import { useUserStore } from '@/stores';
  import { Plus, Upload } from '@element-plus/icons-vue'
  import { ref } from 'vue';

  const uploadRef = ref()
  const userStore = useUserStore()
  const imgUrl = ref(userStore.user.user_pic)
  const loading = ref(false)

  const onUploadFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file.raw)
    reader.onload = () => {
      imgUrl.value = reader.result
    }
  }

  const onUpdateAvatar = async () => {
    loading.value = true
    await userUploadAvatarService(imgUrl.value)
    await userStore.getUser()
    loading.value = false
    ElMessage.success('修改成功')
  }
</script>

<template>
  <PageContainer title="更换头像">
    <el-upload v-loading="loading" :onChange="onUploadFile" ref="uploadRef" class="avatar-uploader" :auto-upload="false" :show-file-list="false">
    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
  <br>
  <el-button @click="uploadRef.$el.querySelector('input').click()" type="primary" :icon="Plus" size="large">选择图片</el-button>
  <el-button @click="onUpdateAvatar" type="success" :icon="Upload" size="large">上传头像</el-button>
  </PageContainer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>