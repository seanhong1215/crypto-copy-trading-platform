<template>
  <div id="app">
    <transition name="el-fade-in-linear">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
  @import "assets/css/bootstrap/bootstrap.min.css";
  @import "assets/css/common_styles.css";
  @import "assets/css/style.css";
  @import "./assets/css/elmentuiReset.less";
* {
  padding: 0;
  margin: 0;
}
img {
  border: none;
  margin: 0;
}
#app {
  font-family: Microsoft YaHei, "微软雅黑", "Avenir", Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
    height: 100%;
  transition: background-color 0.2s ease;
}
.flex {
  display: flex;
}
/* .mechanismTHead {
  font-size: 12px !important;
  padding: 0 !important;
} */
/* .mechanismTHeadRow th {
  background-color: #f8f8f8 !important;
} */
.ecahrtTips {
  color: #ff2233;
}

.TableRowClassName,
.TableAnalyzeRowClassName {
  height: 70px;
  position: relative;
}
.TableHeadRowClassName {
  height: 70px;
  font-size: 16px;
  background-color: #4d4d4d !important;
  line-height: 45px;
  color: #fff;
}
.TableInformationRowClassName {
  height: 22px;
  position: relative;
}
.TableInformationHeadRowClassName {
  height: 22px;
  font-size: 14px;
  background-color: #4d4d4d !important;
  line-height: 22px;
  color: #fff;
}
.TableInformationHeadRowClassName th:nth-child(1) {
  padding-left: 34px !important;
}
.TableNewsRowClassName {
  height: 67px;
  position: relative;
}
.TableNewsHeadRowClassName {
  height: 35px;
  font-size: 14px;
  background-color: #4d4d4d !important;
  line-height: 35px;
  color: #fff;
}
.TableNewsHeadRowClassName th:nth-child(1),
.TableAnalyzeHeadRowClassName th:nth-child(1) {
  padding-left: 34px !important;
}
.TableAnalyzeHeadRowClassName {
  height: 60px;
  font-size: 14px;
  background-color: #4d4d4d !important;
  line-height: 35px;
  color: #fff;
}

.popoverInner {
  font-size: 12px;
  line-height: 22px;
  padding: 10px;
}
.popoverInner span {
  padding-left: 10px;
  color: #999;
}
.container_box{
  /*padding-top: 70px;*/
    height: 100%;
}
@media (max-width:991px) {
  .container_box{
    padding-top: 50px;
  }
}
.newsWrap .TableNewsHeadRowClassName th:nth-child(2), 
.newsWrap .TableAnalyzeHeadRowClassName th:nth-child(2){
  padding-right: 132px !important;
}
.newsWrap .TableNewsRowClassName td:nth-child(2){
  padding-right: 50px !important;
}
@media (max-width:767px) {
  .TableAnalyzeHeadRowClassName{
    height: 40px;
    line-height: 20px;
  }
  .TableNewsHeadRowClassName th:nth-child(1),
  .TableAnalyzeHeadRowClassName th:nth-child(1) {
    padding-left: 10px !important;
  }
  .newsWrap .TableNewsHeadRowClassName th, 
  .newsWrap .TableAnalyzeHeadRowClassName th{
    padding: 6px 0;
  }
  .newsWrap .TableNewsHeadRowClassName th:nth-child(2), 
  .newsWrap .TableAnalyzeHeadRowClassName th:nth-child(2){
    padding-right: 20px !important;
  }
  .newsWrap .TableNewsRowClassName td:nth-child(2){
    padding-right: 0px !important;
    font-size: 12px;
  }
}
.el-drawer__header {
    margin-bottom: 0;
    padding: 20px 20px 0;
}
.el-upload__input {
    display: none !important;
}

#nprogress .bar {
    background: #2a78d6;
    position: fixed;
    z-index: 1031;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
  }
</style>
