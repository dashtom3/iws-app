<template>
  <div class="topbar">
  <mu-appbar :title="$store.state.base.tabInfo[$store.state.base.tabbar].title">
      <mu-icon-button icon='label' slot="left"/>
      <mu-flat-button label="区域查找" slot="right" v-if="$store.state.base.tabbar == 0" @click="changeBottomSheet"/>
      <!-- <mu-flat-button label="签到" slot="right" v-if="$store.state.base.tabbar == 0" @click="changeBottomSheet"/> -->
  </mu-appbar>
  </div>
</template>
<script>
import * as type from './../store/base/type';


export default{
  methods: {
    changeBottomSheet() {
      this.$store.commit(type.BOTTOMSHEET);
    },
  },
};
</script>
<style lang="css" scoped>
    .topbar {
      position: fixed;
      top: 0px;
      width: 100%;
      z-index:99;
    }
</style>
