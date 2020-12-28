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
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option label="开发者资讯" value="shanghai"></el-option>
            <el-option label="ios" value="beijing"></el-option>
            <el-option label="c++" value="beijing"></el-option>
            <el-option label="android" value="beijing"></el-option>
            <el-option label="css" value="beijing"></el-option>
            <el-option label="数据库" value="beijing"></el-option>
            <el-option label="区块链" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            range-separator="至"
            v-model="form.date1"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">筛选</el-button>
        </el-form-item>
        </el-form>
      </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 46150 条结果：</span>
      </div>
      <!-- 数据列表 -->
      <!-- 1、把需要展示的数据列表数据绑定给table组件的data属性 -->
      <!-- 2、设计表格列el-table-column
       prop用来设定要渲染的列表项数据字段 -->
       <!-- 3、表格列默认只能渲染普通文本，如果需要展示
       其他内容，例如放按钮图片等，就需要自定义表格列模板 -->
      <el-table size="small" class="list-table" :data="articles" style="width: 100%">
        <el-table-column prop="" label="封面"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项数据
          那么就在template上声明slot-scope="scope" -->
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="info" v-else-if="scope.row.status === 4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <!-- 如果需要自定义表格列模板，则把需要自动以的内容放到 -->
          <template>
            <el-button type="primary" size="mini" circle icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" circle icon="el-icon-delete"></el-button>
          </template>
          </el-table-column>
        </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'

export default {
  name: 'Article',
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
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      articles: [] // 文章数据列表
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    loadArticles () {
      getArticle().then(res => {
        this.articles = res.data.data.results
      })
    },
    onSubmit () {
      console.log('submit!')
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
</style>
