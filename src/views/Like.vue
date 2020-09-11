<template>
  <div class="like">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    <div class="orderBg"></div>
    <div class="likeBox">
      <div v-if="likeDatas.length > 0">
        <div class="hot-box clearfix">
          <div
            class="product-item fl"
            :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
            v-for="(item,index) in likeDatas"
            :key="index"
          >
            <div class="p-img" @click="viewProductInfo(item.pid)">
              <img class="auto-img" :src="item.smallImg" alt />
            </div>
            <div class="pro-name one-text">{{item.name}}</div>
            <div class="clearfix">
              <div class="pro-price fl">￥{{item.price}}</div>
              <div class="pro-remove fr" @click="removeLike(item.pid,index)">
                <van-icon name="delete" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="noneshop" v-else>
        <van-empty description="收藏空空如也，快去填满购物车吧！">
          <van-button round color="#1989fa" class="bottom-button" @click="goMenu">去逛一逛</van-button>
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/like.less";
import { utils } from "../assets/js/utils";
export default {
  name: "Like",
  data() {
    return {
      //   我的收藏数据
      likeDatas: [],
    };
  },
  created() {
    this.findMyLike();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    //跳转到菜单
    goMenu(){
        this.$router.push({name:'Menu'})
    },

    //获取我的收藏数据
    findMyLike() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //如果没有token数据，表示没有登陆，则需要跳转到登录界面
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "./findAllLike",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 2000) {
            this.likeDatas = result.data.result;
          }
          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //点击图片查询商品详情
    viewProductInfo(pid) {
      
      this.$router.push({ name: "Detail", query: { pid } });
    },

    //取消收藏，删除收藏数据
    removeLike(pid, index) {
      // pid商品id
      //index 下标
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //如果没有token数据，表示没有登陆，则需要跳转到登录界面
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        pid,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "POST",
        url: "/notlike",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          

          // 取消收藏
          if (result.data.code == 900) {
            this.$toast("删除收藏商品成功");
            this.likeDatas.splice(index, 1);
          } else {
            this.$toast("删除收藏商品失败");
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
};
</script>
