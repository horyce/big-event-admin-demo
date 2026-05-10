<script setup>
  import { ref } from 'vue'
  import { articleEditChannelsService, articleAddChannelsService } from '@/api/article'

  const dialogVisible = ref(false)
  const formModel = ref({
    cate_name: '',
    cate_alias: ''
  })
  const formRef = ref()

  const rules = {
    cate_name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
    ],
    cate_alias: [
      { required: true, message: '请输入别名', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
    ]
  }

  const open = (row) => {
    dialogVisible.value = true
    formModel.value = { ...row }
  }

  const emit = defineEmits(['success'])

  const onSubmit = async () => {
    await formRef.value.validate()
    if (formModel.value.id) {
      await articleEditChannelsService(formModel.value)
      ElMessage.success('编辑成功')
    } else {
      await articleAddChannelsService(formModel.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    emit('success')
  }

  defineExpose({
    open
  })
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑' : '添加'" width="500">
    <el-form ref="formRef" :rules="rules" :model="formModel" label-width="100px" style="padding-right: 30px">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" placeholder="请输入名称"></el-input>
      </el-form-item> 
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" placeholder="请输入别名"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>