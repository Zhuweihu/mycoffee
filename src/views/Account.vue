<template>
  <div class="account">
    <van-nav-bar title="个人资料" left-text="返回" left-arrow :fixed="true" @click-left="goback" />
    <div class="account-img"></div>
    <div class="list-box">
      <van-cell title="头像">
        <div class="avatar fr" :style="{backgroundImage: `url(${userInfo.userImg})`}">
          <!-- <img class="auto-img" style="height:100%" :src="userInfo.userImg" alt /> -->
          <van-uploader :after-read="afterRead" class="uploadBox" />
        </div>
      </van-cell>
      <van-cell title="用户id">
        <div class="fr">{{userInfo.userId}}</div>
      </van-cell>
      <van-cell title="手机号">
        <div class="fr">{{userInfo.phone}}</div>
      </van-cell>
      <van-cell title="昵称">
        <input type="text" class="nickName fr" v-model="userInfo.nickName" @change="modifyUserInfo('nickName','/updateNickName')"/>
      </van-cell>

      <div class="desc">
        <div class="list-desc">简介</div>
        <div>
          <textarea class="text-area" placeholder="这个家伙很懒，什么都没有留下" v-model="userInfo.desc" @change="modifyUserInfo('desc','/updateDesc')"></textarea>
        </div>
      </div>
    </div>
    <!-- 插入图片 -->
    <div class="account-foot">
    </div>
  </div>
</template>

<script>
import "../assets/less/account.less";
import {utils} from '../assets/js/utils'
export default {
  name: "Account",
  data() {
    return {
      userInfo: {},

      maxSize:1 * 1024 *1024,
    };
  },
  created() {
    this.getUserInfo();
  },

  methods: {
    goback() {
      this.$router.go(-1);
    },
    //获取账号管理接口数据
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
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if(result.data.code == "B001"){
            this.userInfo = result.data.result[0]
          }
          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },


    //上传头像
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
          color: '#fff',
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
        url: "/updateAvatar",
        data
      })
        .then((result) => {
          this.$toast.clear();
          
          if(result.data.code == "H001"){
            this.userInfo.userImg = result.data.userImg;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //修改用户信息
    modifyUserInfo(key,url){
       //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        [key]:this.userInfo[key],
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
        url: url,
        data
      })
        .then((result) => {
          this.$toast.clear();
          
          this.$toast(result.data.msg)
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //修改昵称
    modifyNickname(){    
       //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        nickName:this.userInfo.nickName,
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
        url: "/updateNickName",
        data
      })
        .then((result) => {
          this.$toast.clear();
          
          if(result.data.code == "C001"){
            this.$toast(result.data.msg)
            this.userInfo.nickName = result.data.nickName;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    
  },
};
</script>
