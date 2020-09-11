<template>
  <div class="forgot">
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
          <div class="close-box" @click="goBack('Home')">先逛一逛</div>
        </template>
      </van-nav-bar>
      <!-- <div class="logo-img">
        <img class="auto-img" src="../assets/images/timg.jpg" alt />
      </div>-->
      <!-- 输入账号密码登录 -->
      <div class="login-form">
        <div class="title">忘记密码！</div>
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
            <van-field v-model="userInfo.email" type="text" label="邮箱" placeholder="邮箱" />

            <van-field v-model="userInfo.validCode" center clearable label="邮箱验证码" placeholder="请输入邮箱验证码">
              <template #button>
                <van-button size="small" type="primary" color="#2790f9" :disabled="isSend" @click="sendCode">{{text}}</van-button>
              </template>
            </van-field>

            <div class="clearfix forgot">
              <span class="fr"  @click="goBack('Login')">已有账号，立即登录</span>
            </div>

            <div class="login-btn">
              <van-button
                color="#0c34b9"
                round
                block
                type="info"
                native-type="submit"
                :style="{'letterSpacing' :'15px'}"
                @click="commit"
              >找回</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/forgot.less";
import { validForm } from "../assets/js/validForm";
import { utils } from "../assets/js/utils";
export default {
  name: "Forgot",
  data() {
    return {
      isPassword: true,
      userInfo: {
        phone: "",
        password: "",
        email: "",
        //验证码
        validCode: "",
      },

      text:'发送验证码',
      isSend:false,
    };
  },

  methods: {
    goBack(name) {
      this.$router.push({ name });
    },
    //查看密码
    viewPassword() {
      this.isPassword = !this.isPassword;
    },

    //发送验证码
    sendCode(){
        let time = 5;
        this.text = time + "s后重新发送";
        this.isSend = true;

        let timer = setInterval(() =>{
            if(time == 0){
                clearInterval(timer);
                this.isSend = false;
                this.text = "发送验证码";
            }else{
                time--;
                this.text = time + "s后重新发送";
            }
            
        },1000);

         //发起请求
      //开启加载模式
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });

      //序列化参数
      let data = utils.queryString({
          appkey:this.appkey,
          email:this.userInfo.email
      });
      

      this.axios({
        method: "POST",
        // 请求参数
        url: "/emailValidCode",
        data,
      })
        .then((result) => {
          //关闭加载提示
          this.$toast.clear();
          
          
          this.$notify({
              type:'warning',
              message:result.data.msg
          })

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //提交,验证验证码
    commit(){
      //获取用户信息
      let userInfo = this.userInfo;
      

      //验证注册表单
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
          errorMsg: "密码支持字母开头数字_组合",
        },
        //邮箱
        email: {
          value: userInfo.email,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          erroerMsg: "邮箱格式不正确",
        },
        //验证码
        validCode: {
          value: userInfo.validCode,
          reg: /^\d{6}$/,
          erroerMsg: "验证码为6位数字",
        },
      };
      if (!validForm.valid(o)) {
        //验证不通过
        return;
      }

      //发起请求
      //开启加载模式
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });

      //序列化参数
      let data = utils.queryString({
          appkey:this.appkey,
          validCode:userInfo.validCode
      });
      

      this.axios({
        method: "POST",
        url: "/checkValidCode",
        data,
      })
        .then((result) => {
          //关闭加载提示
          this.$toast.clear();
          

          //如果验证码验证成功
          if (result.data.code == "K001") {
            //   验证成功
            this.findPassword();
          } else {
            //如果验证码验证失败
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

    //找回密码
    findPassword(){
         //发起请求
      //开启加载模式
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });

      //序列化参数
      let data = utils.queryString({
          appkey:this.appkey,
          phone:this.userInfo.phone,
          password:this.userInfo.password
      });

      this.axios({
        method: "POST",
        url: "/retrievePassword",
        data,
      })
        .then((result) => {
          //关闭加载提示
          this.$toast.clear();
          

          if(result.data.code == "L001"){
              this.$router.push({name:'Login'})
          }else{
              this.$toast(result.data.msg)
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    }
  },
};
</script>
