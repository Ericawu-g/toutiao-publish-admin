<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <app-aside class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i class="el-icon-s-fold"></i>
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
            <el-dropdown-item>
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

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  data () {
    return {
      user: {} // 当前登录用户信息
    }
  },
  created () {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile()
  },
  methods: {
    // 除了登录接口，其它所有接口都需要授权才能请求使用
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
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
    width: 20px;
    background-color: #d3dce6;
    color: #333;
    .aside-menu {
      height: 100%;
    }
  }
  .el-main {
    background-color: #fff;
    color: #333;
    text-align: center;
  }
}
</style>
