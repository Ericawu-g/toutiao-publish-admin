<template>
  <el-menu
    class="nav-menu"
    default-active="/"
    @open="handleOpen"
    @close="handleClose"
    background-color="#002033"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
  >
    <div :class="{
      logo: !isCollapse,
      mlogo: isCollapse
    }"></div>
    <el-menu-item index="/">
      <i class="iconfont iconHomehomepagemenu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont iconimage"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont iconpublish"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont iconmessage1"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="iconfont icongift"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  props: ['is-collapse'],
  data () {
    return {
      // isCollapse: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
.logo {
  width: 100%;
  height: 60px;
  background: url('./logo_admin.png') no-repeat center;
  background-size: 90% 65%;
}
.mlogo {
  width: 100%;
  height: 40px;
  background: url('./mlogo.png') no-repeat center;
  background-size: 60% 80%;
}
.nav-menu {
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
  span {
    padding-right: 70px;
  }
}
</style>
