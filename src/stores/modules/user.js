import { userGetInfoService } from "@/api/user";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const setToken = (newValue) => {
    token.value = newValue
  }

  const user = ref({})
  const getUser = async () => {
    const res = await userGetInfoService()
    user.value = res.data.data
  }
  const setUser = (newValue) => {
    user.value = newValue
  }



  return {
    token,
    setToken,
    user,
    getUser,
    setUser
  }
}, {
  persist: true
})