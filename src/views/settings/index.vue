<template>
  <div class="settings-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-row>
        <el-col :span="11">
          <el-form :rules="rules" ref="form" :model="user" label-width="100px">
            <el-form-item label="编号："> {{ user.id }} </el-form-item>
            <el-form-item label="手机："> {{ user.mobile }} </el-form-item>
            <el-form-item prop="name" label="媒体名称：">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item prop="intro" label="媒体介绍：">
              <el-input v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱：">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdateUser" :loading="updateProfileLoading">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="4" :span="6">
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <label for="file">
            <el-avatar shape="square" :size="160" fit="cover" :src="user.photo">
            </el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            id="file"
            type="file"
            hidden
            ref="file"
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      @opened="onDialogOpened"
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img class="preview-image" :src="previewImage" ref="preview-image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="updatePhotoLoading"
          @click="onUpdatePhoto"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUser } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  data () {
    return {
      user: {
        id: null,
        name: '',
        intro: '',
        photo: '',
        email: '',
        mobile: ''
      }, // 用户资料
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: '', // 预览图片
      cropper: null, // 裁切器实例
      updatePhotoLoading: false, // 更新用户头像
      updateProfileLoading: false, // 更新基本信息的loading状态
      rules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'blur' },
          { max: 200, message: '长度在 200 个字符以内', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { max: 30, message: '长度在 30 个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    loadUser () {
      getUserProfile().then((res) => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 展示弹出层，预览用户选择图片
      this.dialogVisible = true

      // 解决选择相同文件不触发change事件问题
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      // 获取图片DOM节点
      const image = this.$refs['preview-image']
      // 初始化裁切器
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none'
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    onDialogClosed () {
      // 对话框关闭，销毁裁切器
      this.cropper.destroy()
    },
    onUpdatePhoto () {
      // 让确定按钮开始loading
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        //  请求更新用户头像请求提交fd
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示
          this.user.photo = window.URL.createObjectURL(file)
          // 关闭loading
          this.updatePhotoLoading = false

          this.$message({
            type: 'success',
            message: '更新头像成功'
          })

          // 更新顶部登录用户的信息
          globalBus.$emit('update-user', this.user)
        })
      })
    },
    onUpdateUser () {
      // 开启loading状态
      this.updateProfileLoading = true
      // 表单验证
      // 验证通过，提交表单
      updateUser({
        name: this.user.name,
        intro: this.user.intro,
        email: this.user.email
      }).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        // 关闭loading状态
        this.updateProfileLoading = false

        // 发布通知，用户信息已修改
        globalBus.$emit('update-user', this.user)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
