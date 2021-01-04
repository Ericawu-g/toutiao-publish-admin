<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        :model="article"
        ref="publish-form"
        :rules="formRules"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap lang="zh" height="400" v-model="article.content" :extensions="extensions"></el-tiptap>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)"
            >{{this.$route.query.id ? '修改' : '发表'}}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { publishArticles } from '@/api/publish'
import { getArticleChannels, editArticle, getArticle } from '@/api/article'
import {
  ElementTiptap,
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  Image
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImages } from '@/api/image'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap
  },
  data () {
    return {
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [], // 封面图片地址
          channel_id: null
        }
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Image({
          // 默认会把图片生成base64字符串和内容储存在一起
          // 如果需要自定义图片上传
          uploadRequest (file) {
            // 如果接口要求content-type是multipart/form-data，
            // 则请求体必须使用FormData
            const fd = new FormData()
            fd.append('image', file)
            return uploadImages(fd).then(res => {
              return res.data.data.url
            })
          }
        })
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              console.log('validator')
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      }
    }
  },
  created () {
    this.loadChannels()
    // 由于发布和修改使用的同一个组件，所以这里要判断
    // 如果路由路径参数中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft) {
      this.$refs['publish-form'].validate(valide => {
        // 验证失败，停止提交表单
        if (!valide) {
          return
        }
        // 验证通过，提交表单
        const articleId = this.$route.query.id
        if (articleId) {
          // 执行修改操作
          editArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿成功' : '修改成功'}`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        } else {
          // 执行添加操作
          publishArticles(this.article, draft).then(res => {
            // console.log(res)
            this.$message({
              message: `${draft ? '存入草稿成功' : '发布成功'}`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        }
      })
    },
    // 修改文章，加载文章内容
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
