<script setup>
  import { articleGetChannelsService, articleDelChannelsService } from '@/api/article'
  import { ref } from 'vue'
  import { Delete, Edit } from '@element-plus/icons-vue'
  import ChannelEdit from './components/ChannelEdit.vue'

  const loading = ref(false)
  const channelList = ref([])
  const dialog = ref()

  const getChannelList = async () => {
    loading.value = true
    const res = await articleGetChannelsService()
    channelList.value = res.data.data
    loading.value = false
  }
  getChannelList()



  const onEditChannel= (row) => {
    dialog.value.open(row)
  }

  const onDelChannel= async (row) => {
    try {
      await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
      await articleDelChannelsService(row.id)
      ElMessage.success('删除成功')
      getChannelList()
    } catch {}
  }

  const onAddChannel = () => {
    dialog.value.open({})
  }
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column prop="cate_name" label="名称"></el-table-column>
      <el-table-column prop="cate_alias" label="别名"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row, $index }">
          <el-button plain type="primary" :icon="Edit" circle @click="onEditChannel(row, $index)"></el-button>
          <el-button plain type="danger" :icon="Delete" circle @click="onDelChannel(row, $index)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <ChannelEdit @success="getChannelList" ref="dialog"></ChannelEdit>
  </PageContainer>
</template>

<style lang="scss" scoped>
  
</style>