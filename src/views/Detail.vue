<template>
  <div class="detail">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="goBack" />
    <!-- 商品照片 -->
    <div class="detail-img">
      <img class="auto-img" :src="product.large_img" alt />
      <div class="img-name">
        <div>{{product.name}}</div>
      </div>
    </div>
    <!-- 商品详情选择 -->
    <div class="detail-info">
      <!-- 选择商品口味 -->
      <div class="rule-box">
        <div class="rule-item clearfix" v-for="(item,index) in product.rules" :key="index">
          <div class="rule-item-title">{{item.title}}</div>
          <div class="rule-item-tag clearfix">
            <div
              class="fl item-tag"
              :class="{active : v.isActive}"
              v-for="(v,i) in item.rules"
              :key="i"
              @click="toggleRule(v,index)"
            >{{v.title}}</div>
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="desc-box">
        <div class="desc-title">商品描述</div>
        <div class="desc-content">
          <div
            class="desc-text"
            v-for="(item,index) in product.desc"
            :key="index"
          >{{index + 1}}、{{item}}</div>
        </div>
      </div>

      <!-- 价格 -->
      <div class="clearfix desc-pirce-count">
        <div class="fl price">￥{{product.price}}</div>
        <div class="fr count">
          <van-stepper v-model="count" theme="round" button-size="24" disable-input />
        </div>
      </div>
    </div>

    <van-goods-action>
      <van-goods-action-icon
        icon="shopping-cart"
        text="购物车"
        :badge="bagCount == 0 ? '' : bagCount"
        color="#999"
        @click="goShoppingbag"
      />
      <van-goods-action-icon
        icon="like"
        text="收藏"
        :color="isLike ? '#0C34BA' : '#999'"
        @click="likeAndNotLike"
      />
      <van-goods-action-button type="danger" text="加入购物车" color="#6a91ec" @click="addshoppBag" />
      <van-goods-action-button type="danger" text="立即购买" color="#0C34BA" @click="buyNow" />
    </van-goods-action>
  </div>
</template>

<script>
import "../assets/less/detail.less";
import { utils } from "../assets/js/utils";
export default {
  name: "Detail",
  data() {
    return {
      pid: "",
      count: 0,
      product: {},
      isLike: false,
      bagCount: 0,
    };
  },
  created() {
    this.pid = this.$route.query.pid;
    
    this.getProcductBypid();

    this.findLike();

    this.checkfindAllShopcart();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    //跳转到购物车
    goShoppingbag() {
      this.$router.push({ name: "Shoppingbag" });
    },
    //获取商品详情数据
    getProcductBypid() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 600) {
            //处理商品数据
            result.data.result[0].desc = result.data.result[0].desc.split(/\n/);
            // 

            //处理商品规格数据
            let ruleItems = ["tem", "sugar", "cream", "milk"];
            let ruleData = [];
            ruleItems.map((v) => {
              if (result.data.result[0][v] == "") {
                return;
              }

              let rule = {
                title: result.data.result[0][v + "_desc"],
                rules: [],
              };
              let r = result.data.result[0][v].split("/");
              r.map((value, index) => {
                let o = {
                  title: value,
                  isActive: index == 0,
                };
                rule.rules.push(o);
              });
              ruleData.push(rule);
            });
            result.data.result[0].rules = ruleData;
            this.product = result.data.result[0];
            
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    // [
    //   {
    //     title:,
    //     [

    //     ]笑傲楼主
    //   }
    // ]

    //切换规格
    toggleRule(v, index) {
      if (v.isActive) {
        return;
      }
      let ruleData = this.product.rules[index].rules;
      for (let i = 0; i < ruleData.length; i++) {
        if (ruleData[i].isActive) {
          ruleData[i].isActive = false;
          break;
        }
      }
      v.isActive = true;
    },

    //收藏
    likeAndNotLike() {
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
        pid: this.pid,
      });

      // 跳转路径
      let url = this.isLike ? "/notlike" : "/like";

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "POST",
        url,
        data,
      })
        .then((result) => {
          this.$toast.clear();
          

          // 收藏失败
          if (result.data.code == 700) {
            return this.$router.push({ name: "Login" });
          }
          this.$toast(result.data.msg);

          // 收藏与取消收藏
          if (result.data.code == 800) {
            this.isLike = true;
          } else if (result.data.code == 900) {
            this.isLike = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查询商品是否被收藏
    findLike() {
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
        url: "./findlike",
        params: {
          appkey: this.appkey,
          tokenString,
          pid: this.pid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 1000) {
            //如果数据有长度，则说明已被收藏
            if (result.data.result.length == 1) {
              this.isLike = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查询购物车的数目
    checkfindAllShopcart() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          
          if (result.data.code == 5000) {
            this.bagCount = result.data.result.length;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },

    //加入购物车
    addshoppBag(isbuy) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //如果没有token数据，表示没有登陆，则需要跳转到登录界面
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      // 获取选择的规格
      let rules = this.product.rules;
      
      let rule = [];
      rules.map((v) => {
        for (let i = 0; i < v.rules.length; i++) {
          if (v.rules[i].isActive) {
            rule.push(v.rules[i].title);
            break;
          }
        }
        // 
      });
      
      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        pid: this.pid,
        rule: rule.join("/"),
        count: this.count,
      });
      
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
          if (result.data.code == 3000) {
            if (result.data.status == 1) {
              //购物车数据，而不是商品总数量
              this.bagCount++;
            }
            if (isbuy === true) {
              //立即购买
              setTimeout(() => {
                this.$router.push({
                  name: "Pay",
                  query: { sids: result.data.sid },
                });
              }, 1000);
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //立即购买
    buyNow() {
      this.addshoppBag(true);
    },
  },
};
</script>

