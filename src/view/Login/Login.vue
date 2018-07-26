<template>
    <div class="login">
        <!-- <mu-appbar title="关于">
            <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
        </mu-appbar> -->
        <img src="../../assets/image/login_logo.png"> <br/>
        <div v-if="loginState < 2">
        <div class="login-title">
            <mu-text-field label="请输入用户名" type="text" v-model="userLogin.username" labelFloat fullWidth class="login-text"/><br/>
            <div v-if="loginState == 0">
            <mu-text-field label="请输入密码" type="password" v-model="userLogin.password" labelFloat fullWidth class="login-text"/><br/>
            <mu-flat-button label="忘记密码" class="sec-button login-veri-btn" @click="alertMessage()"/>
            </div>
            <!-- <div v-if="loginState == 1">
            <mu-text-field label="请输入验证码" labelFloat fullWidth class="login-text"/><mu-flat-button label="获取验证码" primary @click="changeLogin" class="login-veri1"/><br/>
            <mu-text-field label="请输入密码" type="password" labelFloat fullWidth class="login-text"/><br/>
            <mu-text-field label="请再次确认密码" type="password" labelFloat fullWidth class="login-text"/><br/>
            <mu-flat-button label="使用密码登录" class="sec-button login-veri-btn" @click="changeLogin(0)"/>
            </div> -->
        </div>
        <div class="login-btn">
          <mu-raised-button label="登录" class="login-btn1" primary fullWidth @click="login"/>
          <mu-flat-button label="————— 注册 —————" class="sec-button" @click="changeLogin(2)"/>
        </div>
        </div>
        <div v-if="loginState == 2">
        <div class="login-title2">
            <mu-text-field label="请输入用户名" v-model="userRegister.username" labelFloat fullWidth class="login-text"/><br/>
            <!-- <mu-text-field label="请输入验证码" v-model="userRegister.code" labelFloat fullWidth class="login-text"/><mu-flat-button label="获取验证码" primary @click="getVerifyCode" class="login-veri1"/><br/> -->
            <mu-text-field label="请输入密码"  v-model="userRegister.password" type="password" labelFloat fullWidth class="login-text"/><br/>
            <mu-text-field label="请再次确认密码" type="password" v-model="repassword" labelFloat fullWidth class="login-text"/><br/>
        </div>
        <div class="login-btn">
          <mu-raised-button label="下一步" class="login-btn1" primary fullWidth @click="changeLogin(3)"/>
          <mu-flat-button label="————— 登陆 —————" class="sec-button" @click="changeLogin(0)"/>
        </div>
        </div>
        <div v-if="loginState == 3">
        <div class="login-title2">
            <mu-text-field label="请输入姓名" v-model="userRegister.realName" labelFloat fullWidth class="login-text"/><br/>
            <mu-text-field label="请输入手机号" v-model="userRegister.phone" labelFloat fullWidth class="login-text"/><br/>
            <mu-text-field label="联系地址" v-model="userRegister.address" labelFloat fullWidth multiLine :rows="3" :rowsMax="3" class="login-text"/><br/>

            <!-- <mu-text-field label="简介" labelFloat fullWidth multiLine :rows="2" :rowsMax="2" class="login-text"/><br/> -->
        </div>
        <div class="login-btn">
          <mu-raised-button label="注册" class="login-btn1" primary fullWidth @click="register"/>
          <mu-flat-button label="————— 登录 —————" class="sec-button" @click="changeLogin(0)"/>
        </div>
        </div>
    </div>
</template>
<script>
import { MessageBox, Indicator } from 'mint-ui';
import * as type from './../../store/base/type';


// require('./less/collect.less');

export default{
  data() {
    return {
      loginState: 0,
      userLogin: {
        username: null,
        password: '',
      },
      userRegister: {
        username: null,
        password: '',
        code: null,
        name: null,
        describes: null,
      },
      repassword: '',
    };
  },
  created() {
    this.$store.commit(type.USER_GET);
    if (this.$store.state.base.user != null) {
      this.$router.push({ name: 'Main' });
    }
  },
  methods: {
    changeLogin(state) {
      if (state === 3) {
        if (this.userRegister.password === this.repassword && this.repassword.length > 1) {
          this.loginState = state;
        } else {
          MessageBox('消息', '两次输入密码不一致');
        }
      } else {
        this.loginState = state;
      }
    },
    alertMessage() {
      MessageBox('消息', '请登陆官方网站进行密码修改');
    },
    register() {
      Indicator.open();
      this.$store.dispatch(type.USER_REGISTER, this.userRegister).then(() => {
        Indicator.close();
        MessageBox('消息', '注册成功');
        this.loginState = 0;
        // this.$router.push({ name: 'Main' });
      }).catch((err) => {
        Indicator.close();
        MessageBox('消息', err);
      });
    },
    getVerifyCode() {
      if (this.userRegister.username == null) {
        MessageBox('消息', '请输入手机号');
      } else {
        Indicator.open();
        this.$store.dispatch(type.USER_VERI, { username: this.userRegister.username }).then(() => {
          Indicator.close();
        }).catch((err) => {
          Indicator.close();
          MessageBox('消息', err);
        });
      }
    },
    login() {
      Indicator.open();
      this.$store.dispatch(type.USER_LOGIN, this.userLogin).then(() => {
        Indicator.close();
        this.$router.push({ name: 'Main' });
      }).catch((err) => {
        Indicator.close();
        MessageBox('消息', err);
      });
    },
  },
};
</script>
<style lang="css" scoped>
    .login {
      background: url('../../assets/image/login_bg.png') no-repeat center center fixed;
      -webkit-background-size: 100% 100%;
      -moz-background-size: 100% 100%;
      -o-background-size: 100% 100%;
      background-size: 100% 100%;
      height: 100vh;
      width: 100%;
      text-align: center;
      padding:40px 40px 0px 40px;
    }
    .login-veri1 {
      color: white;
      float: right;
      margin-top: -48px;
      /*margin-right: -15px;*/
      background-color: #2196f3;
    }
    .login-title{
        color: #474a4f;
        font-size: 48px;
        text-align: center;
        margin-bottom: 72px;
    }
    .login-title2{
        color: #474a4f;
        font-size: 48px;
        text-align: center;
        /*padding: 72px 40px 30px 40px;*/
        margin-bottom: 20px;
    }
    .login-text {
      margin-bottom: 0px;
    }
    .login-btn1 {
        margin-bottom: 10px;
    }
    .login img {
      height: 80px;
      width: 80px;
    }
    .login-veri-btn {
      float: right;
      margin-top: -10px;
    }
    /*mu-text-field {
      display: block;
    }*/
</style>
