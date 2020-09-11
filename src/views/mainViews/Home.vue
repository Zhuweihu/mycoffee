<template>
  <div class="home">
    <van-nav-bar :fixed="true">
      <template #left>
        <div class="home-title">
          <div class="homeImg fl" v-if="isLogin" :style="{backgroundImage: `url(${userInfo.userImg})`}"></div>
          {{timeText}},
          <span v-if="isLogin">{{userInfo.nickName}}</span>
          <span v-else>用户</span>
        </div>
      </template>
      <template #right>
        <div class="location">
          <span v-if="loactions.city == '' && loactions.district == ''">定位中</span>
          <span v-else>{{loactions.city}}{{loactions.district}}</span>
        <van-icon name="location-o" /></div>
      </template>
    </van-nav-bar>
    <div class="home-serch">
      <van-search v-model="value" placeholder="请输入搜索关键词"  @click="goSearch"/>
    </div>

    <!-- 轮播图 -->
    <div class="home-banner">
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in bannerData" :key="index">
          <img class="auto-img" :src="item.bannerImg" alt @click="viewProductInfo(item.pid)" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 推荐 -->
    <div class="home-hot">
      <div class="hot-title">热门推荐</div>
      <div class="hot-box clearfix">
        <div
          class="product-item fl"
          :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
          v-for="(item,index) in productData"
          :key="index"
        >
          <div class="p-img" @click="viewProductInfo(item.pid)">
            <img class="auto-img" :src="item.smallImg" alt />
          </div>
          <div class="pro-name one-text">{{item.name}}</div>
          <div class="clearfix">
            <div class="pro-price fl">￥{{item.price}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/home.less";
import {location} from "../../assets/js/location"
export default {
  name: "Home",
  data() {
    return {
      value: "",
      //时间语句
      timeText: "",
      //轮播图数据
      bannerData: [],
      // 热门推荐
      productData: [],

      //用户信息
      userInfo: {},
      isLogin: false,


      //地理位置
      loactions:{
        province:"",
        city:"",
        district:"",
      }
     
    };
  },

  created() {
    this.getTime();
    this.getbannerData();
    this.getproductData();

    this.getUserInfo();

    this.getLocation(); // 调用获取地理位置
    
  },

  methods: {
    //获取时间
    getTime() {
      let hours = new Date().getHours();
      if (hours >= 6 && hours < 12) {
        this.timeText = "早上好";
      } else if (hours >= 12 && hours < 18) {
        this.timeText = "下午好";
      } else if (hours >= 18 && hours < 24) {
        this.timeText = "晚上好";
      } else {
        this.timeText = "深夜好";
      }
    },

    //轮播图
    getbannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
          // 
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //热门推荐
    getproductData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 500) {
            this.productData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查看商品详情
    viewProductInfo(pid) {
      
      this.$router.push({ name: "Detail", query: { pid } });
    },

    //获取用户信息
    getUserInfo() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == "A001") {
            if (result.data.result.length > 0) {
              this.isLogin = true;
              this.userInfo = result.data.result[0];
              
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //跳转搜索商品
    goSearch(){
      this.$router.push({name:'Search'})
    },

    //获取地图定位
    getLocation() {
      let _that = this;
      let geolocation = location.initMap("map-container"); //定位
      AMap.event.addListener(geolocation, "complete", result => {
        _that.lat = result.position.lat;
        _that.lng = result.position.lng;
        _that.province = result.addressComponent.province;
        _that.city = result.addressComponent.city;
        _that.district = result.addressComponent.district;

        // this.loactions.province = result.addressComponent.province;
        this.loactions.city = result.addressComponent.city;
        this.loactions.district = result.addressComponent.district;
      });
    }, 
  },
};
</script>

<style lang="less" scoped>
</style>