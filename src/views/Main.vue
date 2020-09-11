<template>
  <div class="main">
    <div>
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>
    <van-tabbar v-model="tabbariconIndex" active-color="#0C34BA" :route="true">
        
      <van-tabbar-item v-for="(item,index) in tabbaricon" :key="index" :to="item.url">
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive" />
        </template>
      </van-tabbar-item>

    </van-tabbar>
  </div>
</template>

<script>

import '../assets/less/main.less'

export default {
  name: "Main",
  data() {
    return {
      tabbariconIndex: 0,
      tabbaricon: [
        {
          title:'首页',
          icon: {
            active: require("../assets/images/home_active.png"),
            inactive: require("../assets/images/home.png"),
          },
          url:{
              name:'Home'
          }
        },
         {
          title:'菜单',
          icon: {
            active: require("../assets/images/menu_active.png"),
            inactive: require("../assets/images/menu.png"),
          },
          url:{
              name:'Menu'
          }
        },
         {
          title:'购物',
          icon: {
            active: require("../assets/images/shopbag_active.png"),
            inactive: require("../assets/images/shopbag.png"),
          },
          url:{
              name:'Shoppingbag'
          }
        },
         {
          title:'我的',
          icon: {
            active: require("../assets/images/my_active.png"),
            inactive: require("../assets/images/my.png"),
          },
          url:{
              name:'My'
          }
        },
      ],
    };
  },
};
</script>

<style lang="sass" scoped>

</style>