<template>
    <div class="record">
      <Topbar></Topbar>
        <!-- <mu-appbar title="签到列表">
            <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
        </mu-appbar> -->

        <mu-card class="main-card" v-for="item,index in signList" >
          <div style="padding:8px">
            <span><b>签到地址:{{item.realAddress}}</b></span>
            <mu-flat-button label="详情" class="detail-btn" primary @click="showDetail(index)"/>
          </div>
          <div style="padding-bottom:8px;padding-left:8px">
            <span>
              <b>处理人:{{item.userName}}&nbsp;&nbsp;</b>{{item.create_time}}
            </span>
            <!-- <br>
            <span>
              {{item.address}}
            </span> -->
          </div>
            <!-- <mu-icon-button label="详情" slot="right" @click="back"/> -->
            <!-- <mu-flat-button :label="item.userName" class="detail-btn" default disabled/> -->

          </mu-card-header>
          <mu-divider/>
          <mu-card-text v-if="itemShow == index">
            <b>签到地点:</b><span>{{item.address}}</span><span v-if="item.address == null">暂无内容</span><br>
            <b>问题描述:</b><span>{{item.problems}}</span><span v-if="item.problems == null">暂无内容</span><br>
            <b>协调工作:</b><span>{{item.teamwork}}</span><span v-if="item.teamwork == null">暂无内容</span><br>
            <b>详细描述:</b><span>{{item.detailMsg}}</span><span v-if="item.detailMsg == null">暂无内容</span><br>

          </mu-card-text>
        </mu-card>
        <mu-card v-if="signList == null || signList.length == 0">
            <mu-card-text>
              暂无签到信息
            </mu-card-text>
        </mu-card>
        <!-- <mu-infinite-scroll :scroller="scroller" :loading="signArgs.currentPage == signArgs.totalPage" @load="loadMore"/> -->
          <mu-raised-button label="签到" class="record-button" @click="recordWork" primary/>
      <Tabbar></Tabbar>
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
      sysList: null,
      addressSelect: {
        sys: null,
        place: null,
      },
      itemShow: -1,
      user: null,
      signArgs: {
        isMe:'1',
        pageNum: 1,
        pageSize: 50,
        totalPage: -1,
      },
      signList: null,
      scroller: null,
    };
  },
  mounted() {
    this.scroller = this.$el;
  },
  created() {
    this.$store.commit(type.USER_GET);
    this.user = this.$store.state.base.user;
    console.log(this.user);
    this.signArgs.userId = this.user.id;
    this.getSignList();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    loadMore() {
      console.log('111');
      this.signArgs.currentPage = this.signArgs.currentPage + 1;
      this.getSignList();
    },
    getSignList() {
      Indicator.open();
      const self = this;
      this.$store.dispatch(type.SIGN_IN_LIST, this.signArgs).then((data) => {
        console.log(data.data);
        self.signList = data.data.data;
        self.signArgs.totalPage = data.data.page.totalPage;
        self.signArgs.pageNum = data.data.page.pageNum;
        // self.sysList = data.data;
        // self.sysList = self.analyseList(data.data);
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
    analyseList(arr) {
      arr.forEach((system) => {
        const temp = [];
        if (system.locationPack != null) {
          system.locationPack.forEach((pro) => {
            pro.city.forEach((city) => {
              city.area.forEach((area) => {
                area.location.forEach((item) => {
                  temp.push(item);
                });
              });
            });
          });
        }
        system.place = temp;
      });
      return arr;
    },
    myRecord() {
      this.$router.push({ name: 'Record' });
    },
    showDetail(index) {
      this.itemShow = this.itemShow === index ? -1 : index;
    },
    recordWork(){
      this.$router.push({name:'Record'})
    }
  },
};
</script>
<style lang="css" scoped>
    .record{
       -webkit-overflow-scrolling: touch;
       margin-top: 60px;
    }
    .record-content{
      margin-left: 20px;
      margin-right: 20px;
    }
    .detail-btn{
      float: right;
    }
    .main-card{
      margin-left: 10px;
      margin-right: 10px;
      margin-top: 10px;
    }
    .record-button{
      position: fixed;
      bottom:60px;
    }
</style>
