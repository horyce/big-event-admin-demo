<script setup>
  import { userUpdatePassService } from '@/api/user';
  import { useUserStore } from '@/stores';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const pwdForm = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
  })

  const loading = ref(false)

  const rules = {
    // 原密码
    old_pwd: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' }
    ],
    // 新密码
    new_pwd: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
      { 
        validator: (rule, value, callback) => {
          if (value === pwdForm.value.old_pwd) {
            callback(new Error('原密码和新密码不能一样!'))
          }
          callback()
        }, 
        trigger: 'blur' 
      }
    ],
    // 确认新密码
    re_pwd: [
      { required: true, message: '请再次确认新密码', trigger: 'blur' },
      { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
      { 
        validator: (rule, value, callback) => {
          if (value !== pwdForm.value.new_pwd) {
            callback(new Error('新密码和确认再次输入的新密码不一样!'))
          }
          callback()
        }, 
        trigger: 'blur' 
      }
    ]
  }

  const formRef = ref()

  const userStore = useUserStore()
  const router = useRouter()

  const onSubmit = async () => {
    try {
      await formRef.value.validate()
      loading.value = true
      await userUpdatePassService(pwdForm.value)
      loading.value = false
      ElMessage.success('修改成功，请重新登录')
      userStore.setToken('')
      userStore.setToken({})
      router.push('/login')
    } catch {
      loading.value = false
    }
  }

  const onReset = () => {
    pwdForm.value = {
      old_pwd: '',
      new_pwd: '',
      re_pwd: ''
    }
  }

</script>

<template>
  <PageContainer title="重置密码">
    <el-form ref="formRef" :rules="rules" v-loading="loading" label-width="100px" size="large" :model="pwdForm">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit" type="primary">修改密码</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>