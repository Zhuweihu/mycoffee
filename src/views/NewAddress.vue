<template>
  <div class="newaddress">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址' "
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="goBack"
    />

    <van-address-edit
      :area-list="areaList"
      show-postal
      :show-delete="!!aid"
      show-set-default
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      :address-info="setAddressInfo"
      @save="saveAddress"
      @delete="deleteAddress"
    />
  </div>
</template>

<script>
import "../assets/less/newaddress.less";
import areaList from "../assets/js/area";
import { utils } from "../assets/js/utils";

export default {
  name: "NewAddress",
  data() {
    return {
      areaList,
      //地址数据,初始值
      setAddressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false,
      },
      aid: "",
    };
  },

  created() {
    // 从我的地址编辑跳转到新增地址，获取aid
    this.aid = this.$route.query.aid;
    

    // 如果aid有值
    if (this.aid) {
      // 就通过aid查询地址数据
      this.findAddressByAid();
    }
  },

  methods: {
    // 回到上一级
    goBack() {
      this.$router.go(-1);
    },

    //新增地址
    addSave(address) {
      let content = Object.assign({}, address);
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //如果没有token数据，表示没有登陆，则需要跳转到登录界面
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      //删除
      delete content.id;
      delete content.country;

      //把布尔值转换成数字
      content.isDefault = Number(content.isDefault);

      content.appkey = this.appkey;
      content.tokenString = tokenString;

      //参数序列化
      let data = utils.queryString(content);
      

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/addAddress",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 9000) {
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //编辑地址
    editAddress(content) {
      
      

       //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({name: 'Login'});;
      }

      //判断地址是否被修改
      let flag = false;
      for (let key in this.setAddressInfo) {
        if (this.setAddressInfo[key] != content[key]) {
          //已被修改
          flag = true;
          break;
        }
      }

      if (flag) {
        //发起修改请求
        //复制对象
        let addData = Object.assign({}, content);
        delete addData.country;
        delete addData.id;

        addData.aid = this.aid;
        addData.appkey = this.appkey;
        addData.tokenString = tokenString;
        addData.isDefault = Number(addData.isDefault);

        
        //序列化参数v
        let data = utils.queryString(addData);
        

        // 加载
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
          loadingType: "spinner",
        });

        this.axios({
          method: "POST",
          url: "/editAddress",
          data,
        }).then((result) => {
            this.$toast.clear();
            
            if(result.data.code == 30000){
              setTimeout(() =>{
                  this.$router.push({name:'Address'})
              },1000)
            }
        }).catch((err) => {
          this.$toast.clear();
          
        });
      }else{
        this.$router.push({name:'Address'})
      }
    },

    //点击新增地址或者编辑
    saveAddress(address) {
      //如果有地址id
      if (this.aid) {
        // 编辑地址
        this.editAddress(address);
      } else {
        //如果没有id
        //新增地址
        this.addSave(address);
      }
    },

    //根据id查询地址数据
    findAddressByAid() {
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
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 40000) {
            for (let key in this.setAddressInfo) {
              this.setAddressInfo[key] = result.data.result[0][key];
              if (key == "id") {
                this.setAddressInfo[key] = result.data.result[0].aid;
                continue;
              }
              this.setAddressInfo[key] =
                [key] == "isDefault"
                  ? Boolean(result.data.result[0][key])
                  : result.data.result[0][key];
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //删除地址
    deleteAddress() {
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
        aid: this.aid,
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
        url: "/deleteAddress",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 10000) {
            this.$router.push({ name: "Address" });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
};
</script>

