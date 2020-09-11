<template>
  <div class="my">
    <div class="my-bg" :style="{backgroundImage: `url(${userInfo.userBg})`}">
      <div class="my-up fr">
        更换背景
        <van-uploader v-if="isLogin" class="my-upload" :after-read="afterRead"/>
      </div>
      
    </div>

    <div class="my-content">
      <div class="my-box" v-if="isLogin">
        <!-- 头像以及简介 -->
        <div class="my-img">
          <!-- 左边 头像-->
          <div class="my-con-img" :style="{backgroundImage: `url(${userInfo.userImg})`}">
            <!-- <van-image class="auto-img  auto" fit="contain" :src="userInfo.userImg" /> -->
          </div>
          <!-- 右边 简介-->
          <div class="my-con-brief">
            <div class="nickname">{{userInfo.nickName}}</div>
            <div class="desc">{{userInfo.desc == '' ? '这个家伙很懒，什么都没有留下' : userInfo.desc}}</div>
          </div>
        </div>
      </div>

      <div class="my-login" v-else>
        <van-button type="info" @click="goLogin">请登录</van-button>
      </div>

      <div class="my-select">
        <van-cell-group>
          <van-cell
            :title="item.title"
            is-link
            size="large"
            :to="item.to"
            :icon="item.icon"
            v-for="(item,index) in lists"
            :key="index"
          />
        </van-cell-group>
      </div>

      <div class="my-footer">
        <img class="auto-img" src="../../assets/images/foot-1.jpg" alt />
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/my.less";
import {utils} from "../../assets/js/utils"
export default {
  name: "My",
  data() {
    return {
      lists: [
        { title: "个人资料", icon: "user-circle-o", to: { name: "Account" } },
        { title: "我的订单", icon: "coupon-o", to: { name: "Order" } },
        { title: "我的收藏", icon: "label-o", to: { name: "Like" } },
        { title: "收货地址", icon: "location-o", to: { name: "Address" } },
        { title: "安全中心", icon: "warn-o", to: { name: "Secure" } },
      ],
      isLogin: false,

      // 用户信息
      userInfo: {},

      // 最大长传容量
      maxSize: 1 * 1024 * 1024,


    };
  },

  created() {
    this.getUserInfo();


  },

  methods: {

    goLogin() {
      this.$router.push({ name: "Login" });
    },

    //查询与用户信息
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

    //上传背景
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      

      //获取文件类型
      let imgTypes = ['png','jpg','jpeg','jif']
      if(imgTypes.indexOf(file.file.type.split('/')[1]) === -1){
        this.$notify({
          message: '图片类型仅支持'+ imgTypes.join(','),
          color: '#fff',
          background: '#0C34BA',
        })
        return;
      }
      //判断上传尺寸大小
      if(this.maxSize < file.file.size){
        this.$notify({
          message: '图片大小不得大于'+ this.maxSize / 1024 + 'KB',
          color: '#ad0000',
          background: '#0c34ba',
        })
        return;
      }

      //获取base64码
      let base64 = file.content.split(',')[1]
      
       //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        imgType: file.file.type.split('/')[1],
        serverBase64Img: base64
      })

        // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data
      })
        .then((result) => {
          this.$toast.clear();
          
          if(result.data.code == "I001"){
            this.userInfo.userBg = result.data.userBg;
          }
          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

  },
};
</script>

 