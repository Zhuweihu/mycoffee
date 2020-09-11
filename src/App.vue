<template>
  <div id="app">
    <router-view />
  </div>
</template>



<style lang="less">
body {
  background-color: #f4f4f4;
}
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
 /*去除移动端浏览器滚动条：*/
#app::-webkit-scrollbar {
  display: none
}
.fl {
  float: left;
}

.fr {
  float: right;
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

.auto-img {
  width: 100%;
  display: block;
}
.eils{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
}
</style>
