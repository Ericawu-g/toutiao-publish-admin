<template>
  <div class="login-container">
    <!--
      配置form表单验证：
      1、必须给el-form组件绑定model为表单数据
      2、给需要验证的表单项el-form-item绑定prop属性
      3、通过el-form组件的rules属性配置验证规则
      手动触发表单验证：
      1、给el-form设置ref
      2、通过ref获取el-form组件，调用组件的validate进行验证
       -->
    <el-form
     class='login-form'
     ref="login-form"
     :model="user"
     :rules="formRules"
     >
      <div class="login-head"></div>
      <el-form-item prop="mobile">
        <el-input
         v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox
         v-model="user.agree"
         >
         我已阅读并同意用户协议和隐私条款
         </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
         class="login-btn"
         type="primary"
         @click="onLogin"
         :loading="loginLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false // 是否同意协议
      },
      // checked: false, // 是否同意协议的选中状态
      loginLoading: false, // 登录的loading状态
      formRules: { // 表单验证规则设置
      // 要验证的数据名称：规则列表[]
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码' }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过callback()
            // 验证失败callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            // message: '请勾选同意用户协议',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      // const user = this.user

      // 表单验证
      this.$refs['login-form'].validate(valid => {
        // 如果表单验证失败，停止请求提交
        if (!valid) {
          return
        }

        // 验证通过，请求登录
        this.login()
      })
      // 验证通过，提交登录

      // 处理后端响应结果
      // 成功
      // 失败
    },
    login () {
      // 开启登陆中loading
      this.loginLoading = true

      // 对于代码中的请求操作
      // 1、接口请求可能需要重用
      // 2、实际工作中，接口非常容易变动
      // 建议把所有请求都封装成函数然后统一组织到模块中
      login(this.user).then(res => {
        // console.log(res)
        // 登陆成功
        this.$message({
          message: '登录成功',
          type: 'success'
        })

        // 关闭登陆中loading
        this.loginLoading = false

        // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
        // 本地存储只能存字符串，所以要用JSON.stringify转
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 跳转到首页
        this.$router.push('/')
        // 或this.$router.push({name: 'home'})
      }).catch(err => {
        console.log('登陆失败', err)
        // 登陆失败
        this.$message.error('登录失败，手机号或验证码错误')

        // 关闭登陆中loading
        this.loginLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  .login-form {
  background: #fff;
  padding: 20px 50px;
  min-width: 300px;
  .login-head {
  width: 300px;
  height: 57px;
  background: url('./logo_index.png') no-repeat;
  background-size: 55% 60%;
  background-position: center;
  margin-bottom: 20px;
  text-align: center;
  }
  .login-btn {
  width: 100%;
    }
  }
}
</style>
