<template>
    <div class="maintain">
        <Topbar></Topbar>
        <div class="maintain-content">
        <mu-card class="main-card" v-for="item,index in sysList">
          <mu-card-header :title="item.location.locationName" :subTitle="item.system.systemName">
            <!-- <mu-icon-button label="详情" slot="right" @click="back"/> -->
            <!-- <mu-flat-button label="" class="detail-btn" primary @click="showDetail"/> -->
            <mu-divider/>
            <mu-card-text>
              待维护时间：{{item.nextTime}}<br/>
              上次维护时间：{{item.previousTime}}
            </mu-card-text>
          </mu-card-header>
        </mu-card>
        </div>
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
      maintainArgs: {
        locationId: null,
        userId: null,
        startTime: null,
        endTime: null,
        currentPage: 1,
        numberPerPage: 20,
        totalPage: -1,
      },
    };
  },
  created() {
    this.$store.commit(type.USER_GET);
    this.user = this.$store.state.base.user;
    console.log(this.user);
    this.maintainArgs.userId = this.user.id;
    this.getMaintainList();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getMaintainList() {
      Indicator.open();
      const self = this;
      this.$store.dispatch(type.MAINTAIN_LIST, this.maintainArgs).then((data) => {
        console.log(data.data);
        self.sysList = data.data;
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
    showDetail() {

    },
  },
};
</script>
<style lang="css" scoped>
  .maintain{
    text-align: left;
    margin-top: 60px;
    width: 100%;
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
    .maintain-content {
      margin-bottom: 60px;
    }
</style>
