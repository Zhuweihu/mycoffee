<template>
  <div class="address">
    <div>
      <van-nav-bar title="地址管理" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    </div>
    <div class="orderBg"></div>
    <div class="addressBox">

      <div v-if="list.length>0">
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="newAddress"
          @edit="editAddress"
        />
      </div>
      <!-- 没地址空状态 -->
      <div class="add-empty" v-else>
        <van-empty description="暂无地址，请添加地址">
          <van-button round color="#1989fa" class="bottom-button" @click="goMenu">去添加地址</van-button>
        </van-empty>
      </div>

    </div>
  </div>
</template>

<script>
import "../assets/less/address.less";
export default {
  name: "Address",
  data() {
    return {
      // 选择的id
      chosenAddressId: "1",
      //   地址数据
      list: [],
    };
  },

  created() {
    //查询收货地址
    this.getReceiving();
  },
  methods: {
    // 返回上一级
    goBack() {
      this.$router.go(-1);
    },
    
    goMenu(){
      this.$router.push({name:"NewAddress"})
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
            });
            
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },

    //编辑地址
    editAddress(item) {
      
      //跳转到新增地址要改变当前的地址
      this.$router.push({ name: "NewAddress", query: { aid: item.id } });
    },
  },
};
</script>

