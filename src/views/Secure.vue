<template>
  <div class="secure">
    <van-nav-bar title="安全中心" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    <div class="orderBg"></div>
    <div class="secureBox">
      <div>
        <van-cell title="修改密码" isLink size="large" @click="modifyPwd" />
        <van-cell title="注销账号" isLink size="large" @click="diestryAccount" />
      </div>
    </div>

    <div class="secure-btn">
      <van-button round block color="#0c34ba" @click="logOut">退出</van-button>
    </div>

    <!-- 注册 -->
    <div class="register clearfix">
      <van-popup v-model="show" position="bottom" :style="{ height: '45%' }">
        <!-- 关闭 -->
        <div class="register-close">
          <van-nav-bar right-text="X" />
        </div>
        <!-- 注册标题 -->
        <div class="register-title">修改密码</div>
        <!-- 注册表单 -->
        <div class="register-form">
          <van-form>
            <van-field
              v-for="(item,index) in passwords"
              :key="index"
              v-model="item.password"
              :type="item.isPassword ? 'password' : 'type'"
              :placeholder="item.title"
              :right-icon="item.isPassword ? 'closed-eye' : 'eye-o'"
              @click-right-icon="viewPassword(item)"
            />
            <div class="sub-btn">
              <van-button round block type="default" @click="enterPassword">确认修改</van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/secure.less";
import { utils } from "../assets/js/utils";
import { validForm } from "../assets/js/validForm";
export default {
  name: "Secure",
  data() {
    return {
      show: false,
      passwords: {
        Old: {
          password: "",
          isPassword: true,
          title: "旧密码",
        },
        New: {
          password: "",
          isPassword: true,
          title: "新密码",
        },
      },
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    //查看密码
    viewPassword(item) {
      item.isPassword = !item.isPassword;
    },

    //点击修改密码
    modifyPwd() {
      this.show = true;
    },

    //确认修改密码
    enterPassword() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //如果没有token数据，表示没有登陆，则需要跳转到登录界面
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let o = {
        oldpsd: {
          value: this.passwords.Old.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errMsg: "密码仅支持以字母开头的字母数字组合",
        },
        enpsd: {
          value: this.passwords.Old.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errMsg: "密码仅支持以字母开头的字母数字组合",
        },
      };

      //验证表单
      if (!validForm.valid(o)) {
        return;
      }

      //发起修改密码请求
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
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        oldPassword: this.passwords.Old.password,
        password: this.passwords.New.password,
      });

      this.axios({
        method: "POST",
        // 请求参数
        url: "/updatePassword",
        data,
      })
        .then((result) => {
          //关闭加载提示
          this.$toast.clear();
          

          if (result.data.code == "E001") {
            localStorage.removeItem("CTSK");
            this.$router.push({ name: "Login" });
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

    //注销账号
    diestryAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否注销账号",
          confirmButtonColor: "#0c34ba",
        })
        .then(() => {
          //获取token字符串
          let tokenString = localStorage.getItem("CSTK");
          //如果没有token数据，表示没有登陆，则需要跳转到登录界面
          if (!tokenString) {
            return this.$router.push({ name: "Login" });
          }

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
          let data = utils.queryString({
            appkey: this.appkey,
            tokenString,
          });

          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data,
          })
            .then((result) => {
              //关闭加载提示
              this.$toast.clear();
              
              this.$toast(result.data.msg);
              if (result.data.code == "G001") {
                localStorage.removeItem("CTSK");
                setTimeout(() => {
                  this.$router.push({ name: "Login" });
                }, 1000);
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
        })
        .catch(() => {
          // on cancel
        });
    },

    //退出登录
    logOut() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是确认退出登录",
          confirmButtonColor: "#0c34ba",
        })
        .then(() => {
          // 加载
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            loadingType: "spinner",
          });

          localStorage.removeItem("CSTK");
          setTimeout(() => {
            this.$router.push({ name: "Login" });
            this.$toast.clear();
          }, 1000);
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>
