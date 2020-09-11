<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    <div class="orderBg"></div>
    <div class="tagBg">
      <van-tabs v-model="active" title-active-color="#0C34BA" @change="toggleTab">
        <van-tab :title="v.title" v-for="(v, i) in tabItems" :key="i">
          <div v-if="orderDatas.length > 0">
            <div class="tab-item" v-for="(item, index) in orderDatas" :key="index">
              <div class="clearfix tab-itembox">
                <div class="fl no">{{item.orderId}}</div>
                <div class="fr">
                  <div
                    class="text"
                    v-if="item.status == 1"
                    @click="confirmReceipt(item,index)"
                  >确认收货</div>
                  <div class="textbox" v-else>
                    <div class="finished">已完成</div>
                    <div class="delet" @click="removeReceipt(item.orderId,index)">
                      <van-icon name="delete" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-box">
                <div class="order-title">订单信息</div>

                <div>
                  <div class="clearfix cell-box" v-for="(value,i) in item.products" :key="i">
                    <div class="fl content-img">
                      <img class="auto-img" :src="value.smallImg" alt />
                    </div>
                    <div class="fl content-info">
                      <!-- 上层 -->
                      <div class="text-box">
                        <!-- 上上层 -->
                        <div class="clearfix">
                          <!-- 上上层左 -->
                          <div class="fl text-name">{{value.name}}</div>
                          <!-- 上上层右 -->
                          <div class="fl text-rule">{{value.rule}}</div>
                        </div>
                        <!-- 上下层 -->
                        <div class="text-enname">{{value.enname}}</div>
                      </div>
                      <!-- 下层 -->
                      <div class="price-box">
                        <div class="fl price-left">{{value.price}}</div>
                        <div class="fr price-count">X{{value.count}}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="big-pir-box">
                  <div class="clearfix pri-box">
                    <div class="pir-date">{{item.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
                    <div class="clearfix">
                      <div class="fl pir-count">共计{{item.count}}件商品</div>
                      <div class="fr pir-total">合计 ￥{{item.total}}</div>
                    </div>
                  </div>
                  <div class="left-box"></div>
                  <div class="right-box"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 没有订单显示空状态 -->
          <div class="noneshop" v-else>
            <van-empty description="订单空空如也，快去填满购物车吧！">
              <van-button round color="#1989fa" class="bottom-button" @click="goMenu">去逛一逛</van-button>
            </van-empty>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/order.less";
import { utils } from "../assets/js/utils";
export default {
  name: "Order",
  data() {
    return {
      n: "2020-08-13T08:55:25.000Z",
      active: 0,

      orderDatas: [],

      tabItems: [{ title: "全部" }, { title: "待完成" }, { title: "已完成" }],
    };
  },

  created() {
    this.findOrder(0);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    goMenu(){
      this.$router.push({name:'Menu'})
    },

    //获取订单数据
    findOrder(status) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //如果没有token数据，表示没有登陆，则需要跳转到登录界面
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
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
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: status,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          this.orderDatas = [];
          if (result.data.code == 70000) {
            let orderData = {};
            result.data.result.map((v) => {
              // 
              if (!orderData[v.oid]) {
                // 如果不存在该订单数据，则初始化一个对象
                orderData[v.oid] = {
                  orderId: v.oid,
                  date: v.createdAt,
                  count: v.count,
                  total: v.count * v.price,
                  status: v.status,
                  products: [v],
                };
              } else {
                orderData[v.oid].count += v.count;
                orderData[v.oid].total += v.count * v.price;
                orderData[v.oid].products.push(v);
              }
            });

            for (let key in orderData) {
              this.orderDatas.push(orderData[key]);
            }

            this.orderDatas.sort((a, b) => {
              return new Date(b.date).getTime - new Date(a.date).getTime;
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //切换订单状态
    toggleTab(name) {
      this.findOrder(name);
    },

    //确认收货
    confirmReceipt(item, index) {
      //订单号oid
      //哪一个订单号下标：index
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
        oid: item.orderId,
      });

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/receive",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 80000) {
            this.$toast(result.data.msg);
            if (this.active == 1) {
              //进行中
              this.orderDatas.splice(index, 1);
            } else {
              item.status = 2;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //删除订单
    removeReceipt(oid, index) {
      //订单号oid
      //哪一个订单号下标：index
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
        oid,
      });

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/removeOrder",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 90000) {
            this.$toast(result.data.msg);
            //删除订单
            this.orderDatas.splice(index, 1);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
};
</script>


