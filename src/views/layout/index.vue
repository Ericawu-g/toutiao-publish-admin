<template>
  <el-container class="layout-container">
    <el-aside width='auto'>
      <app-aside class="aside-menu" :is-collapse="isCollapse"/>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <!-- class样式处理{
            css类名：布尔值
          } -->
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse
          }" @click="isCollapse = !isCollapse"></i>
          <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="pic" :src="user.photo">
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <i class="el-icon-setting"></i>
              <span>个人设置</span>
            </el-dropdown-item>
            <!--
              组件默认不识别原生事件，除非内部做了处理
             -->
            <el-dropdown-item @click.native="onLogout">
              <i class="iconfont iconsuokai"></i>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边栏展开状态
    }
  },
  created () {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile()

    globalBus.$on('update-user', data => {
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    // 除了登录接口，其它所有接口都需要授权才能请求使用
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },

    onLogout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清除
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .header {
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    .avatar-wrap {
      display: flex;
      align-items: center;
      .pic {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    color: #333;
    .aside-menu {
      height: 100%;
    }
  }
  .el-main {
    background-color: #fff;
    color: #333;
  }
}
</style>
