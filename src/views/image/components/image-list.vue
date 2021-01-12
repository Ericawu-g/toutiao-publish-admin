<template>
  <div class="image-list">
    <!-- 筛选 -->
    <div class="action-head">
      <el-radio-group
        v-model="collect"
        size="small"
        @change="onCollectChange"
      >
        <el-radio-button label="false">全部</el-radio-button>
        <el-radio-button label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button
        size="small"
        type="success"
        @click="dialogUploadVisible = true"
        v-if="isShowAdd"
      >上传素材</el-button
      >
    </div>

    <!-- 中间图片 -->
    <el-row :gutter="10">
      <el-col
        v-for="(img, index) in images"
        :key="index"
        :xs="12"
        :sm="6"
        :md="6"
        :lg="4"
        class="image-item"
        @click.native="selected = index"
      >
        <el-image style="width: 100%; height: 100%" :src="img.url" fit="cover">
        </el-image>
        <div
          class="selected"
          v-if="isShowSelected && selected === index"
        ></div>
        <div class="image-action" v-if="isShowAction">
          <!-- class样式绑定{
            css类名： 布尔值
          } -->
          <el-button
            style="background-color: rgba(0, 0, 0, 0);border: none;font-size: 22px;"
            :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            @click="onCollect(img)"
            size="medium"
            :loading="img.loading"
          ></el-button>
          <!-- <i
            :class="{
              'el-icon-star-on': img.is_collected,
              'el-icon-star-off': !img.is_collected
            }"
            @click="onCollect(img)"
          ></i> -->
          <!-- <i class="el-icon-delete"></i> -->
          <el-button
            style="background-color: rgba(0, 0, 0, 0);border: none;font-size: 22px;"
            icon="el-icon-delete"
            circle
            size="medium"
            :loading="img.loading"
            @click="onDelete(img)"
          ></el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <!-- 分页数据改变以后，页码不会变化 -->
    <!-- 它需要单独处理高亮的页码 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="onPageChange"
      >
    </el-pagination>
    <!-- 弹出层 -->
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadSuccess"
        :show-file-list="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'

export default {
  name: 'ImageList',
  props: {
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean,
      default: true
    },
    // 是否显示图片下方的删除收藏
    isShowAction: {
      type: Boolean,
      default: true
    },
    // 是否展示选择
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询全部素材列表
      images: [], // 图片素材列表
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页大小
      page: 1, // 当前页码
      selected: null // 选中的索引
    }
  },
  created () {
    // 页面初始化加载第一页数据
    this.loadImages(1)
  },
  methods: {
    loadImages (page) {
      // 重置高亮页码，防止数据和页码不对应
      this.page = page

      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then((res) => {
        const results = res.data.data.results
        results.forEach(img => {
          // img 对象本来没有loading数据
          // 我们这里收到的往里面添加该数据是用来控制每个收藏按钮的loading状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },

    onCollectChange (value) {
      this.loadImages(1, value)
    },

    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page)

      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },

    onPageChange (page) {
      this.loadImages(page)
    },

    onCollect (img) {
      // 展示loading
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        // 更新视图状态
        img.is_collected = !img.is_collected
        // 关闭loading
        img.loading = false
      })
      // if (img.is_collected) {
      //   // 已收藏，取消收藏
      //   collectImage(img.id, false)
      // } else {
      //   // 没有收藏，添加收藏
      //   collectImage(img.id, true)
      // }
    },

    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        // 重新加载数据列表
        this.loadImages(this.page)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        img.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-item {
  width: 150px;
  height: 120px;
  border: 1px dashed #ddd;
  position: relative;
  display: inline-block;
  margin: 5px;
  margin-bottom: 10px;;
  padding: 0 !important;
}
.image-action {
  height: 30px;
  width: 100%;
  background: rgba(0,0,0,.3);
  position: absolute;
  left: 0;
  bottom: 0;
  text-align: center;
  line-height: 30px;
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  color: #fff;
}
.selected {
  background: url(./selected.png) no-repeat;
  background-size: cover;
  position: absolute;
  left: 0;
  right: 0;
  top: -15px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
