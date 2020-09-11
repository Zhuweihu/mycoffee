<template>
  <div class="login">
    <div class="login-box">
      <van-nav-bar>
        <template #left>
          <div class="left-text">
            <div class="logo">
              <van-image
                round
                width="36px"
                height="36px"
                :src="require('../assets/images/tabbar_18.png')"
              />
            </div>
            <div class="logo-title">Luckin Coffee</div>
          </div>
        </template>
        <template #right>
          <div class="close-box" @click="goBack">先逛一逛</div>
        </template>
      </van-nav-bar>
      <div class="logo-img">
        <img class="auto-img" src="../assets/images/timg.jpg" alt="">
      </div>
      <!-- 输入账号密码登录 -->
      <div class="login-form">
        <div class="title">欢迎回来！</div>
        <div class="en-title">Please login to your accounts</div>

        <div class="login-form-box">
          <van-form>
            <van-field v-model="userInfo.phone" label="手机号" placeholder="手机号" />
            <van-field
              v-model="userInfo.password"
              :type="isPassword ? 'password' : 'text'"
              label="密码"
              placeholder="密码"
              :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
              @click-right-icon="viewPassword"
            />
            <div class="clearfix forgot" @click="goForgot">
              <span class="fr">忘记密码?</span>
            </div>
            <div class="login-btn">
              <van-button
                color="#0c34b9"
                round
                block
                type="info"
                native-type="submit"
                :style="{'letterSpacing' :'15px'}"
                @click="login"
              >登录</van-button>
            </div>
            <div class="login-btn">
              <van-button
                round
                block
                type="default"
                @click="showPopup"
                :style="{'letterSpacing' :'15px'}"
              >注册</van-button>
            </div>
          </van-form>
        </div>

        <!-- 注册 -->
        <div class="register clearfix">
          <van-popup v-model="show" position="bottom" :style="{ height: '55%' }">
            <!-- 关闭 -->
            <div class="register-close" @click="regClose">
              <van-nav-bar right-text="X" />
            </div>
            <!-- 注册标题 -->
            <div class="register-title">注册</div>
            <!-- 注册表单 -->
            <div class="register-form">
              <van-form>
                <van-field v-model="enterInfo.phone" placeholder="手机号 中国(+86)" />
                <van-field v-model="enterInfo.nickName" placeholder="昵称" />
                <van-field
                  v-model="enterInfo.password"
                  :type="isEnter ? 'password' : 'type'"
                  placeholder="密码"
                  :right-icon="isEnter ? 'closed-eye' : 'eye-o'"
                  @click-right-icon="rePassword"
                />
                <van-field
                  v-model="enPwd"
                  :type="isPwd ? 'password' : 'type'"
                  placeholder="确认密码"
                  :right-icon="isPwd ? 'closed-eye' : 'eye-o'"
                  @click-right-icon="enPassword"
                />
                <div class="sub-btn">
                  <van-button round block type="default" @click="enSubmit">注册</van-button>
                </div>
              </van-form>
            </div>
          </van-popup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/login.less";
import { validForm } from "../assets/js/validForm";
import { utils } from "../assets/js/utils";

export default {
  name: "Login",
  data() {
    return {
      pattern: /\d{6}/,
      //登陆密码
      isPassword: true,
      // 注册密码
      isEnter: true,
      //确认密码
      isPwd: true,
      //弹出框
      show: false,
      //登录
      userInfo: {
        phone: "",
        password: "",
      },
      //注册组件
      enterInfo: {
        phone: "",
        nickName: "",
        password: "",
      },
      enPwd: "",
    };
  },

  // created(){
  //   
  // },

  methods: {
    goForgot(){
      this.$router.push({name:'Forgot'})
    },
    goBack() {
      this.$router.push({name:'Home'})
    },
    //查看密码
    viewPassword() {
      this.isPassword = !this.isPassword;
    },
    //弹出底层框
    showPopup() {
      this.show = true;
    },
    //注册密码眼睛
    rePassword() {
      this.isEnter = !this.isEnter;
    },
    // 确认密码眼睛
    enPassword() {
      this.isPwd = !this.isPwd;
    },
    //点击关闭
    regClose() {
      this.show = false;
    },
    //注册提交
    enSubmit() {
      // 获取用户信息
      let enuserInfo = this.enterInfo;
      

      //验证注册表单
      let o = {
        //手机
        phone: {
          value: enuserInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机格式不正确",
        },
        //昵称
        nickName: {
          value: enuserInfo.nickName,
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
          erroerMsg: "昵称格式不正确",
        },
        //密码
        password: {
          value: enuserInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };
      if (!validForm.valid(o)) {
        //验证不通过
        return;
      }
      if (this.enPwd != enuserInfo.password) {
        this.$notify({
          type: "warning",
          message: "确认密码不一致",
        });
        return;
      }

      //发起请求
      //开启加载模式
      this.$toast.loading({
        message: "加载中...",

        //防止穿透
        forbidClick: true,
        loadingType: "spinner",

        //显示时间, 如果时间为0，则不会自动关闭
        duration: 0,
      });

      //序列化参数
      //复制对象
      let info = Object.assign({}, enuserInfo);
      info.appkey = this.appkey;
      let data = utils.queryString(info);
      

      this.axios({
        method: "POST",
        // 请求参数
        url: "/register",
        data,
      })
        .then((result) => {
          //关闭加载提示
          this.$toast.clear();
          

          //如果注册成功
          if (result.data.code == 100) {
            //关闭底层弹框
            this.show = false;
            //清空表单数据
            for (let key in enuserInfo) {
              enuserInfo[key] = "";
            }
          } else {
            //如果注册失败
            this.$notify({
              type: "warning",
              message: result.data.msg,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //登录
    login() {
      let userInfo = this.userInfo;
      let o = {
        //手机
        phone: {
          value: userInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机格式不正确",
        },
        //密码
        password: {
          value: userInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };

      //验证表单
      if (!validForm.valid(o)) {
        return;
      }

      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      //复制userInfo
      let info = Object.assign({}, userInfo);
      info.appkey = this.appkey;
      let data = utils.queryString(info);

      this.axios({
        method: "POST",
        url: "/login",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          

          if (result.data.code == 200) {
            localStorage.setItem("CSTK", result.data.token);
            this.$router.push({ name: "Home" });
          } else {
            this.$notify({
              type: "warning",
              message: result.data.msg,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>    