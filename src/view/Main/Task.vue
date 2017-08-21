<template>
    <div class="alarm">
        <Topbar></Topbar>
        <mu-card v-for="item,index in newsList">
          <mu-card-header :title="'编号:'+item.id+',设备名称:'+item.groupName" :subTitle="'系统:'+item.systemName+',地点:'+item.locationName+',房间:'+item.roomName">
            <!-- <mu-avatar src="/images/uicon.jpg" slot="avatar"/> -->
          </mu-card-header>
          <!-- <mu-card-title title="Content Title" subTitle="Content Title"/> -->
          <div class="alarm-text">
          <span v-if="item.show == null || item.show == false">
            <b>报警日期:&nbsp;&nbsp;{{item.alarmTime | dateAll2}}-确认日期:{{item.confirmTime | dateAll2}}</b><br/>
            <b>报警信息:</b>{{item.describes.substring(0,150)}}<a class="alarm-more" @click="showMore(item,index)">&nbsp;&nbsp;>>详情&nbsp;&nbsp;</a>
          </span>
          <span v-if="item.show== true">
            <b>报警日期:&nbsp;&nbsp;{{item.alarmTime | dateAll2}}-确认日期:{{item.confirmTime | dateAll2}}</b><br/>
            <b>报警信息:</b>{{item.describes}}<a class="alarm-more" @click="showMore(item,index)">&nbsp;&nbsp;<<收起&nbsp;&nbsp;</a>
          </span>
          </div>
          <mu-card-actions>
            <mu-flat-button v-if="item.status == 1" icon="done" :label="'已确认  分配给'+item.userName" primary/>
            <mu-flat-button v-if="item.status == 0" icon="search" label="未确认" primary/>
          </mu-card-actions>
        </mu-card>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
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
  mounted() {
    this.scroller = this.$el;
  },
  data() {
    return {
      newsList: null,
      args: {
        currentPage: 1,
        numberPerPage: 3,
        status: 1,
      },
      loading: false,
      scroller: null,
    };
  },
  created() {
    this.getNewsList();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getNewsList() {
      Indicator.open();
      const self = this;
      this.$store.dispatch(type.NEWS_LIST, this.args).then((data) => {
        self.newsList = data;
        Indicator.close();
      }).catch((err) => {
        Indicator.close();
        MessageBox('消息', err);
      });
    },
    showMore(item, index) {
      item.show = !item.show;
      this.$set(this.newsList, index, item);
    },
    loadMore() {
      this.loading = true;
      this.args.currentPage = this.args.currentPage + 1;
      this.$store.dispatch(type.NEWS_LIST, this.args).then((data) => {
        self.newsList = data;
        Indicator.close();
      }).catch((err) => {
        Indicator.close();
        MessageBox('消息', err);
      });
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
