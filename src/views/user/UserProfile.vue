<script setup>
  import { useUserStore } from '@/stores'
  import { ref } from 'vue';
  import { userUpdateInfoService } from '@/api/user'

  const { user: { username, nickname, email, id }, getUser } = useUserStore()
  const userInfo = ref({ username, nickname, email, id })

  const formRef = ref()
  const loading = ref(false)

  const rules = {
    nickname: [
      { required: true, message: '请输入用户昵称', trigger: 'blur' },
      {
        pattern: /^\S{2,10}$/,
        message: '昵称必须是2-10位的非空字符串',
        trigger: 'blur'
      }
    ],
    email: [
      { required: true, message: '请输入用户邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
  }

  const submitForm = async () => {
    await formRef.value.validate()
    loading.value = true
    await userUpdateInfoService(userInfo.value)
    await getUser()
    loading.value = false
    ElMessage.success('修改成功')
    
  }
</script>

<template>
  <PageContainer title="基本资料">
    <el-form v-loading="loading" :model="userInfo" :rules="rules" ref="formRef" label-width="100px" size="large">
      <el-form-item label="登录名称">
        <el-input v-model="userInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm" type="primary">提交修改</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>

<style scoped lang="scss">
</style>
