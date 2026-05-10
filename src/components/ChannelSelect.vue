<script setup>
  import { articleGetChannelsService } from '@/api/article'
  import { ref } from 'vue'

  defineProps({
    modelValue: {
      type: [Number, String]
    },
    width: {
      type: String,
      default: "240px"
    }
  })

  const emit = defineEmits(['update:modelValue'])
  const channelList = ref([])
  const getChannelList = async () => {
    const res = await articleGetChannelsService()
    channelList.value = res.data.data
  }
  getChannelList()
</script>

<template>
  <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)" placeholder="请选择文章分类" :style="{ width: width }">
    <el-option v-for="item in channelList" :label="item.cate_name" :value="item.id" :key="item.id"></el-option>
  </el-select>
</template>