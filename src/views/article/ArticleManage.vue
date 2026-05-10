<script setup>
  import { articleDelService, articleGetListService } from '@/api/article';
  import { Delete, Edit } from '@element-plus/icons-vue'
  import { ref } from 'vue';
  import { formatTime } from '@/utils/format';
  import ArticleEdit from '@/views/article/components/ArticleEdit.vue'

  const params = ref({
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
  })
  const articleList = ref([])
  const total = ref(0)
  const loading = ref(false)

  const getList = async () => {
    loading.value = true
    const res = await articleGetListService(params.value)
    articleList.value = res.data.data
    total.value = res.data.total
    loading.value = false
  }
  getList()

  const onSizeChange = () => {
    params.value.pagenum = 1
    getList()
  }

  const onSearch = () => {
    params.value.pagenum = 1
    getList()
  }

  const onReset = () => {
    params.value = {
      pagenum: 1,
      pagesize: 5,
      cate_id: '',
      state: ''
    }
    getList()
  }



  const visibleDrawer = ref(false)
  const articleEditRef = ref()

  const onAddArticle = () => {
    articleEditRef.value.open({})
  }

  const onEditArticle = (row) => {
    articleEditRef.value.open(row)
  }

  const onSuccess = (type) => {
    if (type === 'add') {
      const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
      params.value.pagenum = lastPage
    }
    getList()
  }

  const onDelArticle = async (row) => {
    try {
      await ElMessageBox.confirm('你确认删除该文章吗？', '温馨提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
      await articleDelService(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch {}
  }
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle" type="primary">添加文章</el-button>
    </template>
    <el-form inline>
      <el-form-item label="文章分类：">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state" placeholder="请选择发布状态" style="width: 240px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="articleList" style="width: 100%">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" underline="never">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button plain type="primary" :icon="Edit" circle @click="onEditArticle(row)"></el-button>
          <el-button plain type="danger" :icon="Delete" circle @click="onDelArticle(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="getList"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <ArticleEdit @success="onSuccess" ref="articleEditRef"></ArticleEdit>
  </PageContainer>
</template>