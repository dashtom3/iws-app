<template>
    <div class="me" v-if= "user != null">
        <!-- <Topbar></Topbar> -->
        <div class="me-top">
          <div>
            <h3>{{user.name}}</h3>
            <h4>{{user.username}}</h4>
          </div>
        </div>
        <div>
          <mu-divider />
          <mu-list @change="goPage">
            <mu-list-item :title="item[0]" v-for="item,index in $store.state.base.list" :afterText="item[1]" :value="index">
              <mu-icon slot="right" value="chevron_right" />
            </mu-list-item>
          </mu-list>
          <mu-divider />
          <mu-list>
            <mu-list-item title="服务条款" value="4">
              <mu-icon slot="right" value="chevron_right"/>
            </mu-list-item>
          </mu-list>
        </div>
        <mu-divider />
        <mu-raised-button label="退出登录" class="me-logout" @click="logout" fullWidth/>
        <Tabbar></Tabbar>
    </div>
</template>

<script>
import Tabbar from 'components/Tabbar';
import Topbar from 'components/Topbar';
// import { MessageBox, Indicator } from 'mint-ui';
import * as type from './../../store/base/type';

export default{
  components: {
    Tabbar,
    Topbar,
  },
  data() {
    return {
      // bg: require('~static/img/me_bg.png'),
      user: this.$store.state.base.user,
    };
  },
  created() {
    this.$store.commit(type.USER_GET);
    this.user = this.$store.state.base.user;
    this.$store.commit(type.USER_ADDRESS, this.user.address);
    console.log(this.user);
  },
  methods: {
    goPage(val) {
      if (val === 2) {
        this.$router.push({ name: this.$store.state.base.list[val][2] });
      } else {
        this.$router.push(`/change/${val}`);
      }
    },
    logout() {
      this.$store.commit(type.USER_LOGOUT);
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>
<style lang="css" scoped>
    .main{
        text-align: left;
        height: 100vh;
        width: 100%;
    }
    .me-top {
      height: 200px;
      padding: 40px 0px 50px 0px;
      margin: auto;
      background: url('../../assets/image/me_bg.png') no-repeat top center;
      background-size: cover;
      text-align: center;
    }
    .me-paper {
      height: 100px;
      width: 100px;
      text-align: center;
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.2);

    }
    .me-top>div {
      height: 100%;
      background: url('../../assets/image/me_round.png') no-repeat center center ;
      background-size:contain;
      padding: 5px 0px;
    }
    .me-top h3{
      color: white;
      font-size: 16px;
      text-shadow: 1px 1px 1px #AAAAAA;
    }
    .me-top h4 {
      color: white;
      text-shadow: 1px 1px 1px #AAAAAA;
    }
    .me-logout {
      margin-top: 20px;
      font-size: 16px;
    }
</style>
