<template>
    <div class="member">
        <mu-appbar title="工作组">
            <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
        </mu-appbar>
        <mu-list v-for="item in memberList">
          <mu-list-item :title="item.name" :describeText="'地址:'+item.address" :afterText="item.username">
            <mu-icon slot="left" value="person"/>
          </mu-list-item>
        </mu-list>
    </div>
</template>

<script>
import Tabbar from 'components/Tabbar';
import Topbar from 'components/Topbar';
import { MessageBox, Indicator } from 'mint-ui';
import * as type from './../../store/base/type';

export default{
  components: {
    Tabbar,
    Topbar,
  },
  data() {
    return {
      memberList: null,
      args: {
        currentPage: 1,
        numberPerPage: 20,
        status: 1,
      },
    };
  },
  created() {
    this.getMemberList();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getMemberList() {
      Indicator.open();
      const self = this;
      this.$store.dispatch(type.USER_MEMBER).then((data) => {
        console.log(data.data);
        self.memberList = data.data;
        Indicator.close();
      }).catch((err) => {
        Indicator.close();
        MessageBox('消息', err);
        if (err === '无操作权限') {
          self.$store.commit(type.USER_LOGOUT);
          self.$router.push({ name: 'Login' });
        }
      });
    },
    showMore(item, index) {
      item.show = !item.show;
      this.$set(this.newsList, index, item);
    },
  },
};
</script>
<style lang="css" scoped>
    .alarm{
        text-align: left;
        margin-top: 60px;
        width: 100%;
    }
    .alarm-text {
      margin: 0px 15px 0px 15px;
    }
    .alarm-text span{
      display: inline-block;
      /* text-decoration: none; */
      /* word-wrap: break-word; */
      word-break: break-all;
    }
    .alarm-more {
      color: black;
      font-weight: bold;
    }
</style>
