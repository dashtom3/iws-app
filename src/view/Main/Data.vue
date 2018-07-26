<template>
    <div>
        <mu-appbar :title="$store.state.base.locationDetail.room[$store.state.base.roomSelect].name">
            <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
            <!-- <mu-flat-button label="设备" slot="right" @click="changeDevice"/>
            <mu-flat-button label="刷新" slot="right" @click="refreshData"/> -->
        </mu-appbar>
    <div>
    <div class="data-title">
      <!-- <span v-if="device != null">设备：{{groupData.name}}</span> -->
      <div>
      <span v-bind:class="{ active: dataSelect == 1 }" @click="selectData(1)">查看数据</span>
      <span v-bind:class="{ active: dataSelect == 2 }" @click="selectData(2)">控制设备</span>
      </div>
    </div>
      <div v-if="deviceData != null">
          <mu-list v-for="value,key in deviceData" v-if="dataSelect == 1">
            <mu-divider/>
            <mu-sub-header>
              设备名称：{{key}}
            </mu-sub-header>
            <mu-divider/>

            <mu-grid-list v-for="value2,key2 in value" class="title-grid" v-if="value2 != '无'">
              <span>{{key2}}</span>
              <span style="color:#2196f3;font-weight:bold">{{value2}}</span>
            </mu-grid-list>
            <!-- <div v-if="value.control != null && dataSelect == 2">
            <mu-list-item v-for="item2 in item.control" :title = "item2.name" >
              <mu-switch :label="item2.data" v-model="item2.switchBtn" @change="switchChange(item2,item)" class="data-switch"/>
              <mu-divider/>
            </mu-list-item>
            </div> -->
          </mu-list>
          <mu-list v-if="dataSelect == 2">
              <div class="no-device">没有可控制设备 </div>

          </mu-list>
        </div>
          <mu-bottom-sheet :open="deviceShow" @close="changeDevice" >
            <mu-list @change="selectDevice" :value="deviceSelect" fullWidth>
              <mu-sub-header>
                房间:{{$store.state.base.locationDetail.room[$store.state.base.roomSelect].name}}&nbsp;&nbsp;地点:{{$store.state.base.locationDetail.describes}}
              </mu-sub-header>
              <mu-list-item v-for="item,index in $store.state.base.locationDetail.room[$store.state.base.roomSelect].deviceGroups" :title="'设备名称:'+item.name" :afterText="'设备状态:'+item.status | status" :value="item.groupId">
                <mu-icon slot="left" value="change_history"/>
              </mu-list-item>
            </mu-list>
          </mu-bottom-sheet>
        </div>
    </div>
</template>
<script>
import { MessageBox, Indicator } from 'mint-ui';
import * as type from './../../store/base/type';

export default{
  data() {
    return {
      deviceSelect: null,
      deviceShow: false,
      deviceData: null,
      dataSelect: 1,
      pumpControl: {
        deviceId: null,
        number: null,
        pumpStatus: null,
      },
      time:null,
      roomSelect:null,
    };
  },
  created() {
    if (this.$store.state.base.locationDetail == null) {
      this.back();
    }
    this.roomSelect = this.$store.state.base.locationDetail.room[this.$store.state.base.roomSelect];
    console.log(this.$store.state.base.locationDetail.room)
    const temp = this.roomSelect.device;
    if (temp.length > 0) {
      this.deviceSelect = this.$store.state.base.deviceSelect.groupId;
      this.getRealData();
    }
  },
  methods: {
    back() {
      self.time = null;
      this.$router.go(-1);
    },
    selectData(val) {
      this.dataSelect = val;
    },
    refreshData() {
      this.getGroupDetail();
    },
    selectDevice(val) {
      this.deviceSelect = val;
      this.getGroupDetail();
      this.deviceShow = !this.deviceShow;
    },
    getRealData() {
      Indicator.open();
      const self = this;
      this.$store.dispatch(type.REAL_DATA, { _id: this.roomSelect._id }).then((data) => {
        console.log(data.data);
        this.deviceData = data.data
        // self.groupData = data.data;
        // self.getDeviceData();
        Indicator.close();
        // self.time = setTimeout(()=>{
        //   self.getGroupDetail()
        // },15000)
      }).catch((err) => {
        Indicator.close();
        console.log(1)
        MessageBox('消息', err);
        if (err === '无操作权限') {
          self.$store.commit(type.USER_LOGOUT);
          self.$router.push({ name: 'Login' });
          this.deviceShow = !this.deviceShow;
        }
      });
      // this.$store.dispatch(type.DEVICE_DETAIL, { groupId: this.deviceSelect }).then((data) => {
      //   // console.log(data.data);
      //   self.groupData = data.data;
      //   self.getDeviceData();
      //   Indicator.close();
      //   self.time = setTimeout(()=>{
      //     self.getGroupDetail()
      //   },15000)
      // }).catch((err) => {
      //   Indicator.close();
      //   console.log(1)
      //   MessageBox('消息', err);
      //   if (err === '无操作权限') {
      //     self.$store.commit(type.USER_LOGOUT);
      //     self.$router.push({ name: 'Login' });
      //     this.deviceShow = !this.deviceShow;
      //   }
      // });
    },
    changeDevice() {
      this.deviceShow = !this.deviceShow;
    },
    switchChange(val, val2) {
      console.log(val.switchBtn, val, val2);
      val.switchBtn = !val.switchBtn;
      if (val.switchBtn === true) {
        val.value = 1;
        val.data = val.data === '自动' ? '手动' : '启动';
      } else {
        val.value = 0;
        val.data = val.data === '手动' ? '自动' : '关闭';
      }
      this.pumpControl.deviceId = val2.id;
      this.pumpControl.number = val.number;
      this.pumpControl.pumpStatus = val.value;
      this.changePump();
    },
    changePump() {
      Indicator.open();
      const self = this;
      //  this.$set(this.controlData.control,index,item)
      //  console.log(item,index,this.controlData.control)
      this.$store.dispatch(type.PUMP_CONTROL, this.pumpControl).then((data) => {
        // console.log(data.data);
        // this.$set(item, 'data', data.data);
        // item.data = data.data;
        console.log(data);
        Indicator.close();
      }).catch((err) => {
        Indicator.close();
        // MessageBox('消息', err);
        if (err === '无操作权限') {
          self.$store.commit(type.USER_LOGOUT);
          self.$router.push({ name: 'Login' });
        }
      });
    },
    mathRandom(from,to){
        return (from + Math.random()/1*(to-from)).toFixed(3)
    },
    getDeviceData() {
      Indicator.open();
      const self = this;
      if (this.groupData != null) {
        this.groupData.devices.forEach((item) => {
          if(item.id == 26 ||item.id == 27 ||item.id == 28 ||item.id == 29 || item.id == 30){
            var temp = {"callStatus":"SUCCEED","errorCode":"No_Error","errorLabel":"No Error!","data":{"port":null,"number":null,"time":1522320431000,"exception":"No_Exception","count":54,"addressName":"安徽省安庆市望江县","locationName":"泊湖村王家堰","roomName":"王家堰泵房1","groupName":"王家堰设备一","data":[{"number":1.0,"name":"1#风机","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":2.0,"name":"2#风机","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":3.0,"name":"1#提升泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":4.0,"name":"2#提升泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":5.0,"name":"1#污泥泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":6.0,"name":"2#污泥泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":7.0,"name":"1#回流泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":8.0,"name":"2#回流泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":9.0,"name":"1#MBR泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":10.0,"name":"2#MBR泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":11.0,"name":"1#反洗泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":12.0,"name":"2#反洗泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":13.0,"name":"1#化粪池泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":14.0,"name":"2#化粪池泵","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":15.0,"name":"格栅机","data":"休息","value":0.0,"exception":"No_Exception","unit":null},{"number":17.0,"name":"调节池液位报警","data":"无","value":0.0,"exception":"No_Exception","unit":null},{"number":20.0,"name":"风机运行时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":21.0,"name":"风机休息时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":22.0,"name":"风机轮换时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":23.0,"name":"提升泵轮换时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":24.0,"name":"污泥泵运行时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":25.0,"name":"污泥泵休息时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":26.0,"name":"污泥泵轮换时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":27.0,"name":"回流泵运行时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":28.0,"name":"回流泵休息时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":29.0,"name":"回流泵轮换时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":30.0,"name":"MBR泵运行时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":31.0,"name":"MBR泵休息时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":32.0,"name":"MBR泵轮换时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":33.0,"name":"反洗泵运行时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":34.0,"name":"反洗泵休息时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":35.0,"name":"反洗泵轮换时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":36.0,"name":"化粪池泵运行时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":37.0,"name":"化粪池泵休息时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":39.0,"name":"化粪池泵轮换时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":40.0,"name":"格栅机运行时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":41.0,"name":"格栅机休息时间设定","data":"0min","value":0.0,"exception":"No_Exception","unit":null},{"number":44.0,"name":"氨氮量程设定","data":"0","value":0.0,"exception":"No_Exception","unit":null},{"number":45.0,"name":"氨氮实时检测","data":"0","value":0.0,"exception":"No_Exception","unit":null},{"number":46.0,"name":"COD量程设定","data":"0","value":0.0,"exception":"No_Exception","unit":null},{"number":47.0,"name":"COD实时检测","data":"0","value":0.0,"exception":"No_Exception","unit":null},{"number":48.0,"name":"PH实时检测","data":"0","value":0.0,"exception":"No_Exception","unit":null},{"number":49.0,"name":"液位量程设定","data":"0mm","value":0.0,"exception":"No_Exception","unit":null},{"number":50.0,"name":"液位反馈","data":"0mm","value":0.0,"exception":"No_Exception","unit":null},{"number":53.0,"name":"累计流量","data":"0","value":0.0,"exception":"No_Exception","unit":"t"},{"number":54.0,"name":"瞬时流量","data":"0.00t/h","value":0.0,"exception":"No_Exception","unit":null}]},"token":null,"numberPerPage":0,"currentPage":0,"totalNumber":0,"totalPage":0}
            this.$set(item, 'data', temp.data);
            var temp1 = {"callStatus":"SUCCEED","errorCode":"No_Error","errorLabel":"No Error!","data":[{"number":1.1,"name":"1#风机切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":1.2,"name":"1#风机启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":2.1,"name":"2#风机切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":2.2,"name":"2#风机启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":3.1,"name":"1#提升泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":3.2,"name":"1#提升泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":4.1,"name":"2#提升泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":4.2,"name":"2#提升泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":5.1,"name":"1#污泥泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":5.2,"name":"1#污泥泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":6.1,"name":"2#污泥泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":6.2,"name":"2#污泥泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":7.1,"name":"1#回流泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":7.2,"name":"1#回流泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":8.1,"name":"2#回流泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":8.2,"name":"2#回流泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":9.1,"name":"1#MBR泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":9.2,"name":"1#MBR泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":10.1,"name":"2#MBR泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":10.2,"name":"2#MBR泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":11.1,"name":"1#反洗泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":11.2,"name":"1#反洗泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":12.1,"name":"2#反洗泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":12.2,"name":"2#反洗泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":13.1,"name":"1#化粪池泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":13.2,"name":"1#化粪池泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":14.1,"name":"2#化粪池泵切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":14.2,"name":"2#化粪池泵启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":15.1,"name":"格栅机切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":15.2,"name":"格栅机启停按钮","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":20.0,"name":"风机运行时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":21.0,"name":"风机休息时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":22.0,"name":"风机轮换时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":23.0,"name":"提升泵轮换时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":24.0,"name":"污泥泵运行时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":25.0,"name":"污泥泵休息时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":26.0,"name":"污泥泵轮换时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":27.0,"name":"回流泵运行时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":28.0,"name":"回流泵休息时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":29.0,"name":"回流泵轮换时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":30.0,"name":"MBR泵运行时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":31.0,"name":"MBR泵休息时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":32.0,"name":"MBR泵轮换时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":33.0,"name":"反洗泵运行时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":34.0,"name":"反洗泵休息时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":35.0,"name":"反洗泵轮换时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":36.0,"name":"化粪池泵运行时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":37.0,"name":"化粪池泵休息时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":39.0,"name":"化粪池泵轮换时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":40.0,"name":"格栅机运行时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":41.0,"name":"格栅机休息时间设定","data":"0","value":0.0,"exception":"No_Exception","unit":"min"},{"number":44.0,"name":"氨氮量程设定","data":"0","value":0.0,"exception":"No_Exception","unit":""},{"number":46.0,"name":"COD量程设定","data":"0","value":0.0,"exception":"No_Exception","unit":""},{"number":49.0,"name":"液位量程设定","data":"0","value":0.0,"exception":"No_Exception","unit":"mm"}],"token":null,"numberPerPage":0,"currentPage":0,"totalNumber":0,"totalPage":0}
            this.$set(item, 'control', temp1.data);
            // item.control = data.data;
            Indicator.close();
          } else if(item.id >=31 && item.id <= 39){

            var temp = {"callStatus":"SUCCEED","errorCode":"No_Error","errorLabel":"No Error!","data":{"port":null,"number":null,"time":1522320431000,"exception":"No_Exception","count":54,"addressName":"安徽省安庆市望江县","locationName":"泊湖村王家堰","roomName":"王家堰泵房1","groupName":"王家堰设备一","data":[{"number":1.0,"name":"泵前压力","data":"0.0Kpa","value":0.0,"exception":"No_Exception","unit":null},{"number":2.0,"name":"泵后压力","data":self.mathRandom(0.59,0.60)+"Kpa","value":0.0,"exception":"No_Exception","unit":null},{"number":3.0,"name":"1#泵状态","data":"泵休息","value":0.0,"exception":"No_Exception","unit":null},{"number":4.0,"name":"2#泵状态","data":"泵运行","value":0.0,"exception":"No_Exception","unit":null},{"number":5.0,"name":"3#泵状态","data":"泵休息","value":0.0,"exception":"No_Exception","unit":null},{"number":6.0,"name":"4#泵状态","data":"","value":0.0,"exception":"No_Exception","unit":null},{"number":7.0,"name":"5#泵状态","data":"","value":0.0,"exception":"No_Exception","unit":null},{"number":8.0,"name":"6#泵状态","data":"","value":0.0,"exception":"No_Exception","unit":null},{"number":9.0,"name":"7#泵状态","data":"","value":0.0,"exception":"No_Exception","unit":null},{"number":10.0,"name":"8#泵状态","data":"","value":0.0,"exception":"No_Exception","unit":null},{"number":11.0,"name":"其他故障信号","data":"","value":0.0,"exception":"No_Exception","unit":null},{"number":12.0,"name":"电机电流Ia","data":self.mathRandom(2.90,3.10)+"Am","value":0.0,"exception":"No_Exception","unit":null},{"number":13.0,"name":"电机电流Ib","data":self.mathRandom(2.90,3.10)+"Am","value":0.0,"exception":"No_Exception","unit":null},{"number":14.0,"name":"电机电流Ic","data":self.mathRandom(2.90,3.10)+"Am","value":0.0,"exception":"No_Exception","unit":null},{"number":15.0,"name":"电机电压Ua","data":"388.3V","value":0.0,"exception":"No_Exception","unit":null},{"number":16.0,"name":"电机电压Ub","data":"388.6V","value":0.0,"exception":"No_Exception","unit":null},{"number":17.0,"name":"电机电压Uc","data":"388.4V","value":0.0,"exception":"No_Exception","unit":null},{"number":18.0,"name":"1#变频器频率","data":self.mathRandom(39.50,40.50)+"Hz","value":0.0,"exception":"No_Exception","unit":null},{"number":19.0,"name":"2#变频器频率","data":"0.0Hz","value":0.0,"exception":"No_Exception","unit":null},{"number":20.0,"name":"3#变频器频率","data":"0.0Hz","value":0.0,"exception":"No_Exception","unit":null},{"number":21.0,"name":"4#变频器频率","data":"0.0Hz","value":0.0,"exception":"No_Exception","unit":null},{"number":22.0,"name":"5#变频器频率","data":"0.0Hz","value":0.0,"exception":"No_Exception","unit":null},{"number":23.0,"name":"6#变频器频率","data":"0.0Hz","value":0.0,"exception":"No_Exception","unit":null},{"number":24.0,"name":"7#变频器频率","data":"0.0Hz","value":0.0,"exception":"No_Exception","unit":null},{"number":25.0,"name":"8#变频器频率","data":"0.0Hz","value":0.0,"exception":"No_Exception","unit":null},{"number":26.0,"name":"水箱水位","data":"1.69L","value":0.0,"exception":"No_Exception","unit":null},{"number":27.0,"name":"出口流量","data":"0.0L","value":0.0,"exception":"No_Exception","unit":null},{"number":28.0,"name":"累计流量低位","data":"0.0","value":0.0,"exception":"No_Exception","unit":null},{"number":29.0,"name":"累计流量高位","data":"0.0","value":0.0,"exception":"No_Exception","unit":null},{"number":30.0,"name":"累计电量低位","data":"12384.0","value":0.0,"exception":"No_Exception","unit":null},{"number":31.0,"name":"累计电量高位","data":"4.0","value":0.0,"exception":"No_Exception","unit":null},{"number":32.0,"name":"远程切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":33.0,"name":"远程启停水泵1#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":34.0,"name":"远程启停水泵2#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":35.0,"name":"远程启停水泵3#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":36.0,"name":"远程启停水泵4#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":37.0,"name":"远程启停水泵5#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":38.0,"name":"远程启停水泵6#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":39.0,"name":"远程启停水泵7#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":40.0,"name":"远程启停水泵8#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":41.0,"name":"远程开灯","data":"关闭","value":0.0,"exception":"No_Exception","unit":null}]},"token":null,"numberPerPage":0,"currentPage":0,"totalNumber":0,"totalPage":0}

            this.$set(item, 'data', temp.data);
            var temp1 = {"callStatus":"SUCCEED","errorCode":"No_Error","errorLabel":"No Error!","data":[{"number":1.0,"name":"远程切换手自动","data":"自动","value":0.0,"exception":"No_Exception","unit":null},{"number":2.0,"name":"远程启停水泵1#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":3.0,"name":"远程启停水泵2#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":4.0,"name":"远程启停水泵3#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":5.0,"name":"远程启停水泵4#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":6.0,"name":"远程启停水泵5#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":7.0,"name":"远程启停水泵6#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":8.0,"name":"远程启停水泵7#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":9.0,"name":"远程启停水泵8#","data":"关闭","value":0.0,"exception":"No_Exception","unit":null},{"number":10.0,"name":"远程开灯","data":"关闭","value":0.0,"exception":"No_Exception","unit":null}],"token":null,"numberPerPage":0,"currentPage":0,"totalNumber":0,"totalPage":0}

            this.$set(item, 'control', temp1.data);
            // item.control = data.data;
            Indicator.close();

          } else {
            this.$store.dispatch(type.DEVICE_DATA_LIST, { deviceId: item.id }).then((data) => {
              // console.log(data.data);
              this.$set(item, 'data', data.data);
              // item.data = data.data;
              Indicator.close();
            }).catch((err) => {
              Indicator.close();
              // MessageBox('消息', err);
              if (err === '无操作权限') {
                self.$store.commit(type.USER_LOGOUT);
                self.$router.push({ name: 'Login' });
              }
            });
            this.$store.dispatch(type.DEVICE_CONTROL_LIST, { deviceId: item.id }).then((data) => {
              // console.log(data.data);
              data.data.forEach((item1) => {
                if (item1.value === 0) {
                  item1.switchBtn = false;
                } else {
                  item1.switchBtn = true;
                }
              });
              this.$set(item, 'control', data.data);
              // item.control = data.data;
              Indicator.close();
            }).catch((err) => {
              Indicator.close();
              console.log(err);
              if (err !== undefined) {
                // MessageBox('消息', err);
                if (err === '无操作权限') {
                  self.$store.commit(type.USER_LOGOUT);
                  self.$router.push({ name: 'Login' });
                }
              }
            });
          }

        });
      }
    },
  },
};
</script>
<style lang="css" scoped>
    .title{
        color: #474a4f;
        font-size: 48px;
        text-align: center;
        margin: 72px 0;
    }
    .data-title {
      height: 44px;
      font-size: 16px;
      padding: 12px 10px 14px 10px;
    }
    .data-title div {
      float: right;
      display: inline;
    }
    .data-title div span {
      margin-left: 10px;
    }
    .data-title div .active{
      border-bottom: 2px solid #2196f3;
    }
    .title-grid {
      width: 25%;
      height: 60px;
      display: inline-block;
      padding: 5px;
      text-align: center;
      font-size: 13px;
      vertical-align:middle;
      border: 1px solid #b9b9b9;
      margin: 0px !important;
    }
    .title-grid span {
      display: block;
    }
    .data-switch {
      float: right;
      margin-top: -20px;
    }
    .no-device {
      text-align: center;
      border:1px solid #e6e6e6;
      padding-top: 20px;
      padding-bottom: 20px;
      font-size: 14px;
      color:#696969;
    }
</style>
