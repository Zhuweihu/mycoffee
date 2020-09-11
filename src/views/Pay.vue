<template>
  <div class="pay">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    <!-- 地址 -->
    <div class="address-box">
      <div class="address">
        <div class="clearfix">
          <div class="fl add-title" @click="showPopup">选择收货地址</div>
          <div class="fl add-icon" @click="showPopup">
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="add-content">
          <!-- 个人信息 -->
          <div class="clearfix">
            <div class="fl add-hname">{{currentAddress.name}}</div>
            <div class="fl add-phone">{{currentAddress.tel}}</div>
          </div>
          <!-- 地址 -->
          <div class="add-info">{{currentAddress.address}}</div>
        </div>
      </div>
    </div>

    <!-- 订单 -->
    <div class="order-info">
      <div class="order-box">
        <div class="order-title">订单信息</div>
        <div>
          <div class="clearfix cell-box" v-for="(item,index) in shoppingbagData" :key="index">
            <div class="fl content-img">
              <img class="auto-img" :src="item.small_img" alt />
            </div>
            <div class="fl content-info">
              <!-- 上层 -->
              <div class="text-box">
                <!-- 上上层 -->
                <div class="clearfix">
                  <!-- 上上层左 -->
                  <div class="fl text-name">{{item.name}}</div>
                  <!-- 上上层右 -->
                  <div class="fl text-rule">{{item.rule}}</div>
                </div>
                <!-- 上下层 -->
                <div class="text-enname">{{item.enname}}</div>
              </div>
              <!-- 下层 -->
              <div class="price-box">
                <div class="fl price-left">￥{{item.price}}</div>
                <div class="fr price-count">X{{item.count}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="big-pir-box">
          <div class="clearfix pri-box">
            <div class="fl pir-count">共计{{product.count}}件商品</div>
            <div class="fr pir-total">合计 ￥{{product.total}}</div>
          </div>
          <div class="left-box"></div>
          <div class="right-box"></div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="pay-btn">
      <van-button round block color="#0c33ba" @click="pay">立即结算</van-button>
    </div>

    <van-popup v-model="show" position="bottom">
      <div class="addre-title">选择收货地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @select="sAddress"
        @add="newAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/pay.less";
import {utils} from '../assets/js/utils'
export default {
  name: "Pay",
  data() {
    return {
      // 弹出层
      show: false,

      chosenAddressId: "1",

      // 地址列表数据
      list: [],

      // 初始化，选择地址数据
      currentAddress: {
        name: "",
        tel: "",
        address: "",
      },

      // 购物车商品数据
      shoppingbagData:[],

      // sids
      sids: [],

      product:{
        count:0,
        total:0,
      },
      
    };
  },
  created() {
    this.sids = this.$route.query.sids.split('=');
    
    this.getReceiving();

    this.getShoppingbagSids();
  },
  methods: {
    //弹出底层选择地址
    showPopup() {
      this.show = true;
    },

    //选择地址
    sAddress(item, index) {
      this.show = false;
      // 
      // 

      for (let key in this.currentAddress) {
        this.currentAddress[key] = item[key];
        // 
      }
    },

    //跳转新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },

    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    //查询收货地址
    getReceiving() {
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
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString: tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 20000) {
            result.data.result.map((v) => {
              let address = v.province + v.city + v.county + v.addressDetail;
              this.list.push({
                id: v.aid,
                name: v.name,
                address,
                isDefault: Boolean(v.isDefault),
                tel: v.tel,
              });
              //如果是默认地址
              if (Boolean(v.isDefault)) {
                (this.chosenAddressId = v.aid),
                  (this.currentAddress.name = v.name),
                  (this.currentAddress.tel = v.tel),
                  (this.currentAddress.address = address);
              }
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //根据sids查询购物车商品数据
    getShoppingbagSids() {
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
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString: tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if(result.data.code == 50000){

            if(result.data.result.length == 0){
              this.$router.push({name:'Menu'})
            }

              this.shoppingbagData = result.data.result;

              // 商品总数，商品总价格
              result.data.result.map(v =>{
                this.product.count += v.count;
                this.product.total += v.count *v.price; 
              })
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //立即结算
    pay(){
      //判断是否选择地址
      if(this.chosenAddressId == ''){
        this.$toast("请选择地址");
        return;
      }

       //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      // 参数序列化
      let data = utils.queryString({
         appkey: this.appkey,
        tokenString: tokenString,
        sids: JSON.stringify(this.sids),
        phone: this.currentAddress.tel,
        address: this.currentAddress.address,
        receiver: this.currentAddress.name
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
        url: "/pay",
        data,
      }) .then((result) => {
          this.$toast.clear();
          
          this.$toast(result.data.msg)
          if(result.data.code == 60000){
              this.$router.push({name:'Order'});
          }
        }).catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
};
</script>

