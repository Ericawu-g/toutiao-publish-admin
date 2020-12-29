<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form size="small" ref="form" :model="form" label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <!-- el-radio默认把lable作为文本和选中之后的value值 -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            range-separator="至"
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- button按钮的click事件有个默认参数
          当你没有指定参数的时候，它会默认传递
          一个类似page:{"isTrusted":true} -->
          <el-button :disabled="loading" type="primary" @click="loadArticles(1)">筛选</el-button>
        </el-form-item>
        </el-form>
      </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到{{ totalCount }}条结果：</span>
      </div>
      <!-- 数据列表 -->
      <!-- 1、把需要展示的数据列表数据绑定给table组件的data属性 -->
      <!-- 2、设计表格列el-table-column
       prop用来设定要渲染的列表项数据字段 -->
       <!-- 3、表格列默认只能渲染普通文本，如果需要展示
       其他内容，例如放按钮图片等，就需要自定义表格列模板 -->
      <el-table
        size="small"
        class="list-table"
        :data="articles"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="" label="封面">
          <template slot-scope="scope">
            <img
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
              class="article-cover"
            >
            <img
              v-else
              src="./no-cover.gif"
              class="article-cover"
            >
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项数据
          那么就在template上声明slot-scope="scope" -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
            <!-- <el-tag type="warning" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="info" v-else-if="scope.row.status === 4">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <!-- 如果需要自定义表格列模板，则把需要自动以的内容放到 -->
          <template slot-scope="scope">
            <el-button type="primary" size="mini" circle icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" circle icon="el-icon-delete" @click="onDeleteArticle(scope.row.id)"></el-button>
          </template>
          </el-table-column>
        </el-table>
      <!-- 分页 -->
      <!-- total用来设定总数据条数
      它默认按照10条每页计算总页码
      page-size每页显示条目个数-->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="loading"
        @current-change="onCurrentChange"
        :page-size="pageSize"
        :current-page.sync="page"
        >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getArticle,
  getArticleChannels,
  deleteArticle
} from '@/api/article'

export default {
  name: 'ArticleIndex',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章数据列表
      articleStatus: [
        { text: '草稿', status: 0, type: 'warning' },
        { text: '待审核', status: 1 },
        { text: '审核通过', status: 2, type: 'success' },
        { text: '审核失败', status: 3, type: 'danger' },
        { text: '已删除', status: 4, type: 'info' }
      ],
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页大小
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 查询文章频道
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true, // 表格数据加载时显示动效
      page: 1 // 当前页码
    }
  },
  created () {
    this.loadChannels()
    this.loadArticles()
  },
  methods: {
    loadArticles (page = 1) {
      // 展示加载中loading
      this.loading = true
      getArticle({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount

        // 关闭加载中loading
        this.loading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },

    onCurrentChange (page) {
      this.loadArticles(page)
    },

    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },

    onDeleteArticle (articleId) {
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认执行这里
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新当前页文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 150px;
  background-size: cover;
}
</style>
