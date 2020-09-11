import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import 'lib-flexible/flexible'

import {
  Popup,
  Button,
  NavBar,
  Form,
  Toast,
  Field,
  Image as VanImage,
  Tabbar,
  TabbarItem,
  Notify,
  Search,
  Swipe,
  SwipeItem,
  Skeleton,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Stepper,
  SwipeCell,
  cell,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  Empty,
  Icon,
  AddressList,
  AddressEdit,
  Cell,
  CellGroup,
  Uploader,
  Tab,
  Tabs,
  Dialog,
} from 'vant';

Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Toast)
  .use(Field)
  .use(Popup)
  .use(VanImage)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Notify)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Skeleton)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Stepper)
  .use(SwipeCell)
  .use(cell)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(Empty)
  .use(Icon)
  .use(AddressList)
  .use(AddressEdit)
  .use(Cell)
  .use(CellGroup)
  .use(Uploader)
  .use(Tab)
  .use(Tabs)
  .use(Dialog)

//注册axios, ajax方案，用于请求数据
Vue.use(VueAxios, axios)

//设置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

Vue.config.productionTip = false

//添加一个Vue的原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

//全局注册过滤器 一般用于格式化数
Vue.filter("formatDate", (value, format) => {
  //value：需要格式化的数据
  //format：指定格式yyyy-MM-dd hh:mm:ss

  let date = new Date(value);

  //获取年份
  let year = date.getFullYear();
  // 
  if (/(y+)/.test(format)) {
    //获取匹配组的内容
    let content = RegExp.$1;
    format = format.replace(content, year.toString().slice(4 - content.length))
    // 
  }

  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };

  for (let key in o) {
    //构造动态正则
    let reg = new RegExp(`(${key}+)`);

    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      let d = o[key] >= 0 ? o[key] : content.length == 2 ? '0' + o[key] : o[key]
      format = format.replace(content, d);
      // 
    }
  }
  return format
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
