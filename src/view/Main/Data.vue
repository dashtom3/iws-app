<template>
    <div>
        <mu-appbar :title="$store.state.base.locationDetail.room[$store.state.base.roomSelect].name">
            <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
            <mu-flat-button label="设备" slot="right" @click="changeDevice"/>
            <mu-flat-button label="刷新" slot="right" @click="refreshData"/>
        </mu-appbar>
    <div>
    <div class="data-title">
      <span v-if="groupData != null">设备：{{groupData.name}}</span>
      <div>
      <span v-bind:class="{ active: dataSelect == 1 }" @click="selectData(1)">查看数据</span>
      <span v-bind:class="{ active: dataSelect == 2 }" @click="selectData(2)">控制设备</span>
      </div>
    </div>
      <div v-if="groupData != null">
          <mu-list v-for="item in groupData.devices" >
            <mu-divider/>
            <mu-sub-header>
              控制器：{{item.name}}
            </mu-sub-header>
            <mu-divider/>
            <div v-if="item.data != null && dataSelect == 1 ">
            <mu-grid-list v-for="item1 in item.data.data" class="title-grid" v-if="item1.data != ''">
              <span>{{item1.name}}</span>
              <span style="color:#2196f3;font-weight:bold">{{item1.data}}</span>
            </mu-grid-list>
            </div>
            <div v-if="item.control != null && dataSelect == 2">
            <mu-list-item v-for="item2 in item.control" :title = "item2.name" >
              <mu-switch :label="item2.data" v-model="item2.switchBtn" @change="switchChange(item2,item)" class="data-switch"/>
              <mu-divider/>
            </mu-list-item>
            </div>
            <div v-if="item.control == null && dataSelect == 2">
              <mu-list-item title = "没有可控制设备" >
              </mu-list-item>
            </div>
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
      groupData: null,
      dataSelect: 1,
      pumpControl: {
        deviceId: null,
        number: null,
        pumpStatus: null,
      },
    };
  },
  created() {
    if (this.$store.state.base.locationDetail == null) {
      this.back();
    }
    const temp1 = this.$store.state.base.roomSelect;
    const temp = this.$store.state.base.locationDetail.room[temp1].deviceGroups;
    if (temp.length > 0) {
      this.deviceSelect = this.$store.state.base.deviceSelect.groupId;
      this.getGroupDetail();
    }
  },
  methods: {
    back() {
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
    getGroupDetail() {
      Indicator.open();
      const self = this;
      this.$store.dispatch(type.DEVICE_DETAIL, { groupId: this.deviceSelect }).then((data) => {
        // console.log(data.data);
        self.groupData = data.data;
        self.getDeviceData();
        Indicator.close();
      }).catch((err) => {
        Indicator.close();
        MessageBox('消息', err);
        if (err === '无操作权限') {
          self.$store.commit(type.USER_LOGOUT);
          self.$router.push({ name: 'Login' });
          this.deviceShow = !this.deviceShow;
        }
      });
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
        MessageBox('消息', err);
        if (err === '无操作权限') {
          self.$store.commit(type.USER_LOGOUT);
          self.$router.push({ name: 'Login' });
        }
      });
    },
    getDeviceData() {
      Indicator.open();
      const self = this;
      if (this.groupData != null) {
        this.groupData.devices.forEach((item) => {
          this.$store.dispatch(type.DEVICE_DATA_LIST, { deviceId: item.id }).then((data) => {
            // console.log(data.data);
            this.$set(item, 'data', data.data);
            // item.data = data.data;
            Indicator.close();
          }).catch((err) => {
            Indicator.close();
            MessageBox('消息', err);
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
              MessageBox('消息', err);
              if (err === '无操作权限') {
                self.$store.commit(type.USER_LOGOUT);
                self.$router.push({ name: 'Login' });
              }
            }
          });
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
</style>
