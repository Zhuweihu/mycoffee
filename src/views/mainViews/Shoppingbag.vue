<template>
  <div class="shoppingbag">
    <van-nav-bar
      title="购物袋"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-right="onEdit"
      @click-left="goBack"
    >
    <template #right v-if="shoppingbag.length > 0">
      <div>
        {{isEidt ? '完成' : '编辑'}}
      </div>
    </template>
    </van-nav-bar>
    <div class="image-box">
      <img  src="../../assets/images/hear.jpg" alt="">
    </div>
    <div v-if="shoppingbag.length > 0">
      <van-swipe-cell :disabled="!isEidt" v-for="(item,index) in shoppingbag" :key="index">
        <van-cell :border="false">
          <div class="clearfix cell-box">
            <div class="fl check">
              <van-checkbox
                v-model="item.isCheck"
                :checked-color="'#0C34BA'"
                icon-size="22px"
                @click="simpleCheck"
              ></van-checkbox>
            </div>
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
                <div class="fr">
                  <van-stepper
                    v-model="item.count"
                    theme="round"
                    button-size="22"
                    disable-input
                    @change="modifyShopbagCount(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </van-cell>
        <template #right>
          <van-button square type="danger" text="删除" @click="removeOneShopbag(item.sid)" />
        </template>
      </van-swipe-cell>

      <!-- 底部 -->
      <div>
        <van-submit-bar
          v-show="!isEidt"
          :price="total"
          button-text="提交订单"
          :button-color="'#0C34BA'"
          @submit="goPay"
        >
          <van-checkbox
            v-model="checked"
            :checked-color="'#0C34BA'"
            icon-size="22px"
            @click="allCheck"
          >全选</van-checkbox>
        </van-submit-bar>

        <van-submit-bar
          v-show="isEidt"
          button-text="删除选择"
          :button-color="'#0C34BA'"
          @submit="removeMoreShopbag"
        >
          <van-checkbox
            v-model="checked"
            :checked-color="'#0C34BA'"
            icon-size="22px"
            @click="allCheck"
          >全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>

    <div v-else>
      <van-empty description="购物车空空如也，快去填满购物车吧！">
        <van-button round color="#1989fa" class="bottom-button" @click="goMenu">去逛一逛</van-button>
      </van-empty>
    </div>
  </div>
</template>

<script>
import "../../assets/less/shoppingbag.less";
import { utils } from "../../assets/js/utils";
export default {
  name: "Shoppingbag",
  data() {
    return {
      isEidt: false,
      //全选
      checked: false,

      shoppingbag: [],
      // 总金额
      total: 0,
    };
  },

  created() {
    this.findShopbag();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },
    //回到菜单
    goMenu() {
      this.$router.push({ name: "Menu" });
    },
    // 前往支付页面
    goPay(){
      
      //查找需要购买的商品sid
      let sids = [];
      this.shoppingbag.map(v =>{
        if(v.isCheck){
          sids.push(v.sid); 
        }
      })

      if(sids.length == 0){
        this.$toast("请选择商品");
        return;
      }
      sids = sids.join('=');

      this.$router.push({ name:'Pay',query:{sids}})
      // 
    },
    // 编辑商品
    onEdit() {
      this.isEidt = !this.isEidt;
    },

    // 查询购物车数据
    findShopbag() {
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
          tokenString: tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 5000) {
            result.data.result.map((v) => {
              v.isCheck = false;
            });
            this.shoppingbag = result.data.result;
            // 
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //全选
    allCheck() {
      this.shoppingbag.map((v) => {
        v.isCheck = this.checked;
      });
      this.sum();
    },

    //单选
    simpleCheck() {
      this.sum();
      for (let i = 0; i < this.shoppingbag.length; i++) {
        if (!this.shoppingbag[i].isCheck) {
          this.checked = false;
          return;
        }
      }
      this.checked = true;
    },

    // 修改购物车商品数量
    modifyShopbagCount(item) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      // 参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString: tokenString,
        sid: item.sid,
        count: item.count,
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
        url: "/modifyShopcartCount",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          this.sum();
          if (result.data.code !== 6000) {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //删除商品
    removeShopbag(sids) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      // 参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString: tokenString,
        sids: JSON.stringify(sids),
      });

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      return this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data,
      });
    },

    // 删除单个商品
    removeOneShopbag(sid, index) {
      this.removeShopbag([sid])
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 7000) {
            this.shoppingbag.splice(index, 1);
            this.sum();
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 删除多个商品
    removeMoreShopbag() {
      // 查找被选择的商品
      let sids = [];
      this.shoppingbag.map((v) => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });

      this.removeShopbag(sids)
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 7000) {
            for (let i = this.shoppingbag.length - 1; i >= 0; i--) {
              if (this.shoppingbag[i].isCheck) {
                this.shoppingbag.splice(i, 1);
              }
            }
            this.sum();
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 计算总金额
    sum() {
      this.total = 0;
      this.shoppingbag.map((v) => {
        if (v.isCheck) {
          this.total += v.count * v.price;
        }
      });
      this.total = this.total * 100;
    },
  },
};
</script>
