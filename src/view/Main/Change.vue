<template>
    <div class="change">
        <mu-appbar :title="title">
            <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
            <mu-flat-button label="完成" slot="right" @click="change"/>
        </mu-appbar>
        <div class="change-input" v-if="$route.params.id == 0">
          <mu-text-field type="password" v-model="password.oldPwd" hintText="旧密码" fullWidth/><br/>
          <mu-text-field type="password" v-model="password.newPwd" hintText="新密码" fullWidth/><br/>
          <mu-text-field type="password" v-model="repassword" hintText="重复密码" fullWidth/><br/>
        </div>
        <div class="change-input" v-if="$route.params.id == 1">
          <mu-text-field v-model="address" hintText="修改地址" fullWidth/><br/>
        </div>
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
      title: '',
      password: {
        oldPwd: null,
        newPwd: null,
      },
      address: null,
      repassword: null,
    };
  },
  created() {
    this.title = this.$store.state.base.list[this.$route.params.id][0];
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    change() {
      if (this.$route.params.id === '0') {
        if (this.password.newPwd !== this.repassword && this.password.newPwd !== null && this.password.newPwd !== '') {
          MessageBox('消息', '新密码与重复密码不一致');
        } else {
          Indicator.open();
          const self = this;
          this.$store.dispatch(type.USER_CHANGE_PASS, self.password).then(() => {
            MessageBox('消息', '密码修改成功');
            Indicator.close();
            this.$router.go(-1);
          }).catch((err) => {
            Indicator.close();
            MessageBox('消息', err);
            if (err === '无操作权限') {
              self.$store.commit(type.USER_LOGOUT);
              self.$router.push({ name: 'Login' });
            }
          });
        }
      } else if (this.$route.params.id === '1') {
        Indicator.open();
        const self = this;
        this.$store.dispatch(type.USER_UPDATE, { address: this.address }).then(() => {
          Indicator.close();
          this.$router.go(-1);
        }).catch((err) => {
          Indicator.close();
          MessageBox('消息', err);
          if (err === '无操作权限') {
            self.$store.commit(type.USER_LOGOUT);
            self.$router.push({ name: 'Login' });
          }
        });
      }
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
    .change-input {
      margin: 2px 10px 2px 10px;
    }
</style>
