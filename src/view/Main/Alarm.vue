<template>
    <div class="alarm">
        <Topbar></Topbar>
        <div class="alarm-title">
          <!-- <span v-if="device != null">设备：{{groupData.name}}</span> -->
          <div>
          <span v-bind:class="{ active: dataSelect == 1 }" @click="selectData(1)">实时数据</span>
          <span v-bind:class="{ active: dataSelect == 2 }" @click="selectData(2)">历史数据</span>
          </div>
        </div>
        <div v-if="dataSelect == 1">
          <div v-if="realAlarmList == null || realAlarmList.length == 0" class="no-alarm">
            暂无实时报警数据
          </div>
        <mu-card v-for="item,index in realAlarmList">
          <!-- <mu-card-header :title="'设备名称:'+item.groupName" :subTitle="'系统:'+item.systemName+',地点:'+item.locationName+',房间:'+item.roomName">
          </mu-card-header> -->
          <mu-card-header :title="item.devInfo+'('+item.ip+':'+item.zhan+')'" :subTitle="item.locInfo+'('+item.sysInfo+')'">
          </mu-card-header>
          <!-- <mu-card-title title="Content Title" subTitle="Content Title"/> -->
          <div class="alarm-text">
          <span>
            <b v-if="item.alarmData.worker">分配人员:&nbsp;&nbsp;{{item.alarmData.worker.realName}},{{item.alarmData.worker.phone}}</b>
            <b v-else>分配人员:&nbsp;&nbsp;尚未分配</b>
            <br/>
            <b>报警日期:&nbsp;&nbsp;{{item.alarmData.create_time}}</b><br/>
            <b v-if="item.alarmData.worker_time">分配日期:&nbsp;&nbsp;{{item.alarmData.worker_time}}</b>
            <b v-else>分配日期:&nbsp;&nbsp;无</b>
            <br/>
            <b v-if="item.alarmData.finish_time">完成日期:&nbsp;&nbsp;{{item.alarmData.finish_time}}</b>
            <b v-else>完成日期:&nbsp;&nbsp;无</b>
            <br/>
          </span>
          <span v-if="item.show == null || item.show == false">
            <b>报警信息:</b>{{item.alarmData.info.substring(0,150)}}<a class="alarm-more" @click="showMore(item,index)">&nbsp;&nbsp;>>详情&nbsp;&nbsp;</a>
          </span>
          <span v-if="item.show== true">
            <b>报警信息:</b>{{item.alarmData.info}}<a class="alarm-more" @click="showMore(item,index)">&nbsp;&nbsp;<<收起&nbsp;&nbsp;</a>
          </span>
          </div>
          <mu-card-actions>
            <mu-flat-button icon="done" label="完成任务" primary/>
          </mu-card-actions>
        </mu-card>
        </div>
        <div v-else>
          <div v-if="alarmList == null || alarmList.length == 0" class="no-alarm">
            暂无实时报警数据
          </div>
          <mu-card v-for="item,index in alarmList">
            <!-- <mu-card-header :title="'设备名称:'+item.groupName" :subTitle="'系统:'+item.systemName+',地点:'+item.locationName+',房间:'+item.roomName">
            </mu-card-header> -->
            <mu-card-header :title="item.devInfo+'('+item.ip+':'+item.zhan+')'" :subTitle="item.locInfo+'('+item.sysInfo+')'">
            </mu-card-header>
            <!-- <mu-card-title title="Content Title" subTitle="Content Title"/> -->
            <div class="alarm-text">
            <span>
              <b v-if="item.workerEntity">分配人员:&nbsp;&nbsp;{{item.workerEntity.realName}},{{item.workerEntity.phone}}</b>
              <b v-else>分配人员:&nbsp;&nbsp;尚未分配</b>
              <br/>
              <b>报警日期:&nbsp;&nbsp;{{item.oldAlarmData.create_time}}</b><br/>
              <b v-if="item.oldAlarmData.worker_time">分配日期:&nbsp;&nbsp;{{item.oldAlarmData.worker_time}}</b>
              <b v-else>分配日期:&nbsp;&nbsp;无</b>
              <br/>
              <b v-if="item.oldAlarmData.finish_time">完成日期:&nbsp;&nbsp;{{item.oldAlarmData.finish_time}}</b>
              <b v-else>完成日期:&nbsp;&nbsp;无</b>
              <br/>
            </span>
            <span v-if="item.show == null || item.show == false">
              <b>报警信息:</b>{{item.oldAlarmData.info.substring(0,150)}}<a class="alarm-more" @click="showMore(item,index)">&nbsp;&nbsp;>>详情&nbsp;&nbsp;</a>
            </span>
            <span v-if="item.show== true">
              <b>报警信息:</b>{{item.oldAlarmData.info}}<a class="alarm-more" @click="showMore(item,index)">&nbsp;&nbsp;<<收起&nbsp;&nbsp;</a>
            </span>
            </div>
            <mu-card-actions>
              <mu-flat-button icon="done" label="完成任务" primary/>
            </mu-card-actions>
          </mu-card>
          <mu-raised-button label="加载更多" @click="loadMore" default fullWidth v-if="alarmList != null && args.totalPage != args.pageNum"/>
          <mu-raised-button label="没有更多内容了" default fullWidth v-if="alarmList != null && args.totalPage == args.pageNum"/>
        </div>
        <div class="bottom"></div>

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
      alarmList: null,
      realAlarmList:null,
      dataSelect: 1,
      args: {
        pageNum: 1,
        pageSize: 20,
        totalPage: null,
        isMe:"1"
      },
      userList:null,
      sysList:null,
    };
  },
  created() {

    this.getUserList();
    this.getSystemList();
  },
  methods: {
    back() {

      this.$router.go(-1);
    },
    selectData(){
      if(this.dataSelect == 1){
        this.dataSelect = 2
        this.alarmList = []
        this.getAlarmList()
      } else {
        this.dataSelect = 1
      }
    },
    getSystemList(){
      this.$store.dispatch(type.SYSTEM_LIST).then((data) => {
        this.sysList = data.data.data;
        console.log(this.sysList)
        this.getRealAlarmList()
        Indicator.close();
      }).catch((err) => {
        Indicator.close();
        MessageBox('消息', err);
        if (err === '无操作权限') {
          this.$store.commit(type.USER_LOGOUT);
          this.$router.push({ name: 'Login' });
        }
      });
    },
    getUserList(){
      this.$store.dispatch(type.USER_LIST,{pageNum:1,pageSize:100000}).then((data) => {
        this.userList = data.data.data;
        console.log(this.userList);
      }).catch((err) => {

        MessageBox('消息', err);
        if (err === '无操作权限') {
          this.$store.commit(type.USER_LOGOUT);
          this.$router.push({ name: 'Login' });
        }
      });
    },
    getRealAlarmList() {
      // Indicator.open();
      const self = this;
      this.$store.dispatch(type.REAL_ALARM_LIST,{}).then((data) => {
        this.realAlarmList = data.data
        this.analyseSensor(this.realAlarmList )
        // Indicator.close();
        var time = setTimeout(()=>{
          this.getRealAlarmList()
        },15000)
        this.$store.commit(type.ALERT_TIME,time)
      }).catch((err) => {
        // Indicator.close();
        MessageBox('消息', err);
        if (err === '无操作权限') {
          self.$store.commit(type.USER_LOGOUT);
          self.$router.push({ name: 'Login' });
        }
      });
    },
    analyseSensor(dataAnalyse){
      dataAnalyse.forEach(sensor=>{
        if(!sensor.sysInfo){
          this.sysList.forEach(sys=>{
            sys.location.forEach(loc=>{
              loc.room.forEach(room=>{
                room.device.forEach(dev=>{
                  dev.sensor.forEach(sensor2=>{
                    if(sensor2._id == sensor._id){
                      console.log(sensor)
                      sensor.sysInfo = sys.name
                      sensor.locInfo = loc.name+':'+room.name
                      sensor.devInfo = dev.name
                      if(this.dataSelect != 1){
                        if(sensor.oldAlarmData.worker){
                          this.userList.forEach(item=>{
                            if(item._id == sensor.oldAlarmData.worker){
                              console.log(item)
                              sensor.workerEntity = item
                            }
                          })
                        }
                      }
                    }
                  })
                })
              })
            })
          })
        }
      })
    },
    getAlarmList() {
      Indicator.open();
      const self = this;
      this.$store.dispatch(type.ALARM_LIST, this.args).then((data) => {
        console.log(data)
        this.analyseSensor(data.data.data)
        if (self.alarmList == null) {
          self.alarmList = data.data.data;
        } else {
          self.alarmList = self.alarmList.concat(data.data.data);
        }

        self.args.pageNum = data.data.pageNum;
        self.args.totalPage = data.data.totalPage;
        self.args.pageSize = data.data.pageSize;
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
      this.$set(this.realAlarmList, index, item);
      console.log(item.show);
    },
    loadMore() {
      this.args.currentPage = this.args.currentPage + 1;
      this.getAlarmList();
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
    .bottom {
      height: 56px;
    }
    .alarm-title {
      height: 44px;
      font-size: 16px;
      padding: 12px 10px 14px 10px;
    }
    .alarm-title div .active{
      border-bottom: 2px solid #2196f3;
    }
    .no-alarm {
      text-align: center;
      padding-top: 20px;
      padding-bottom: 20px;
      color:#696969;
      border:1px solid #d9d9d9;
    }

</style>
