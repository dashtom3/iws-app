<template>
  <mu-paper class="tabbar">
    <mu-bottom-nav :value="bottomNav" shift @change="handleChange">
      <mu-bottom-nav-item v-for="item in $store.state.base.tabInfo" :value="item.value" :title="item.title" :icon="item.icon" />
    </mu-bottom-nav>
  </mu-paper>

</template>

<script>
import * as type from './../store/base/type';

export default {
  data() {
    return {
      bottomNav: '',
      bottomNavColor: '',
    };
  },
  created() {
    this.bottomNav = this.$route.name;
    this.bottomNavColor = this.$route.name;
    this.$store.commit(type.TABBAR, this.$route.name);
  },
  methods: {
    handleChange(val) {
      this.bottomNav = val;
      this.$store.commit(type.TABBAR, val);
      this.$router.push({ name: val });
    },
  },
};
</script>
<style lang="css" scoped>
    .tabbar {
      position: fixed;
      bottom: 0px;
      width: 100%;
      z-index:99;
    }
</style>
