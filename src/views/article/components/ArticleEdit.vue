<script setup>
  import { ref } from 'vue';
  import { Plus } from '@element-plus/icons-vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import { articleEditService, articleGetDetailService, articlePublishService } from '@/api/article'
  import { baseURL } from '@/utils/request';
  import axios from 'axios';
  
  const imageUrl = ref('')
  const formRef = ref()
  const visibleDrawer = ref(false)
  const defaultForm = {
    title: '',
    cate_id: '',
    cover_img: '',
    content: '',
    state: ''
  }
  const formModel = ref({ ...defaultForm })

  const emit = defineEmits(['success'])

  const rules = {
    title: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    cate_id: [{ required: true, message: '请选择内容', trigger: 'blur' }],
    // cover_img: [{ required: true, message: '请选择图片', trigger: 'blur' }],
    // content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
  }

  const onUploadFile = (uploadFile) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw)
    formModel.value.cover_img = uploadFile.raw
  }

  const editorRef = ref()

  const open = async (row) => {
    visibleDrawer.value = true
    if (row.id) {
      const res = await articleGetDetailService(row.id)
      formModel.value = res.data.data
      imageUrl.value = baseURL + formModel.value.cover_img
      const file = await urlToFile(imageUrl.value, formModel.value.cover_img)
      formModel.value.cover_img = file
    } else {
      formModel.value = { ...defaultForm }
      imageUrl.value = ''
      editorRef.value?.setHTML?.('')
    }
  }

  const onPublish = async (state) => {
    await formRef.value.validate()
    formModel.value.state = state
    const fd = new FormData()
    for (let key in formModel.value) {
      fd.append(key, formModel.value[key])
    }
    if (formModel.value.id) {
      await articleEditService(fd)
      ElMessage.success('编辑成功')
      visibleDrawer.value = false
      emit('success', 'edit')
    } else {
      // 添加请求
      await articlePublishService(fd)
      ElMessage.success('添加成功')
      visibleDrawer.value = false
      emit('success', 'add')
    }
  }

  async function urlToFile(imgUrl, fileName) {
    try {
      const res = await axios({
        method: 'get',
        url: imgUrl,
        responseType: 'blob', 
      })
      const file = new File(
        [res.data], 
        fileName,   
        { type: res.data.type } 
      )
      return file
    } catch (err) {
      console.error('图片转File失败：', err)
      throw err
    }
  }

  defineExpose({
    open
  })
</script>

<template>
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '添加文章'" size="40%">
    <el-form ref="formRef" :rules="rules" :model="formModel" label-width="100px">
      <el-form-item prop="title" label="文章标题">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item prop="cate_id" label="文章分类">
        <ChannelSelect v-model="formModel.cate_id" width="100%"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面">
        <el-upload :on-change="onUploadFile" :auto-upload="false" class="avatar-uploader" :show-file-list="false">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus/></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容">
        <div class="editor">
          <QuillEditor ref="editorRef" v-model:content="formModel.content" content-type="html"></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>