<template>
  <div class="search">
    <div class="head clearfix">
      <div class="head-serch fl">
        <van-search
          v-model="value"
          placeholder="请输入搜索关键词"
          @input="searchProduct"
          @clear="searchClear"
        />
      </div>
      <div class="cancel fr" @click="goBack">取消</div>
    </div>

    <!-- 商品 -->
    <div class="searchPud">
      <div class="hot-box clearfix" >

          <div
            class="product-item fl"
            :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
            v-for="(item,index) in searchData"
            :key="index"
          >
            <div class="p-img" @click="viewProductInfo(item.pid)">
              <img class="auto-img" :src="item.smallImg" alt />
            </div>
            <div class="pro-name one-text">{{item.name}}</div>
            <div class="clearfix">
              <div class="pro-price fl">￥{{item.price}}</div>
            </div>
          </div>
       

      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/search.less";
export default {
  name: "Search",
  data() {
    return {
      value: "",
      //搜索商品数据
      searchData: [],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    //搜索商品
    searchProduct() {
      
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name: this.value,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == "Q001") {
            if (result.data.result.length != 0) {
              this.searchData = result.data.result;
            } else {
              this.$toast("没有此关键词商品");
            }
          }
          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //清除商品
    searchClear() {
        this.searchData.length = 0
    },

     //查看商品详情
    viewProductInfo(pid) {
      
      this.$router.push({ name: "Detail", query: { pid } });
    },

  },
};
</script>

<style lang="less" scoped>
</style>