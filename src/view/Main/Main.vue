<template>
    <div class="main">
        <Topbar></Topbar>
        <div class="amap-wrapper">
          <!-- <el-amap :vid="'amap-vue'" :zoom="7"> -->
          <el-amap :vid="'amap-vue'" :zoom="7" :map-manager="mainMap" :center="center">
            <div v-for="system,index1 in sysList" v-if="addressSelect.sys == index1 || addressSelect.sys == -1">
                <el-amap-marker v-for="item in system.location" :position="[item.lat,item.lng]"
                  :content="item.content" :visible="true" :events="item.events" >
                </el-amap-marker>
            </div>
          </el-amap>
        </div>
        <mu-bottom-sheet :open="$store.state.base.bottomSheet" @close="changeBottomSheet" v-if="sysList != null" sheetClass="bottomSheet">
          <mu-select-field v-model="addressSelect.sys"  label="选择系统" fullWidth>
            <mu-menu-item :value="-1" title="全部" />
            <mu-menu-item v-for="sys,index in sysList" :key="index" :value="index" :title="sys.name" />
          </mu-select-field>
        </mu-bottom-sheet>
        <mu-bottom-sheet :open="roomBottom" @close="changeRoomBottom" v-if="$store.state.base.locationDetail != null" sheetClass="bottom-sheet">
            <div class="shet-title">
              名称:{{$store.state.base.locationDetail.name}}&nbsp;&nbsp;地点:{{$store.state.base.locationDetail.address}}
            </div>
            <mu-divider />
            <div class="gridlist" v-for="item,index in $store.state.base.locationDetail.room">
              <div class="gridname">房间名称: {{item.name}}
              </div>
              <div class="shet-middle">
              <div v-for="item1, index1 in item.device" :key="index" class="gridcard" @click="goDataPage(index,item1)">

                <!-- <span><b>{{item1.roomName}}</b></span> -->
                <img src="../../assets/image/device.png" />
                <mu-divider />
                <span>{{item1.name}}</span>
              </div>
              <div v-if="item.device == null || item.device.length == 0" style="text-align:center;padding-top:10px">
                该房间暂无泵设备
              </div>
              </div>
              <mu-divider/>
            </div>
            <div v-if="$store.state.base.locationDetail.room.length == 0" style="text-align:center;padding-top:40px;">
              该地点暂无泵房信息
              <mu-divider style="margin-top:40px"/>
            </div>
          <!--  <mu-list @change="goDataPage" :value="roomSelect" fullWidth>
              <mu-sub-header>
                <b>名称:{{$store.state.base.locationDetail.name}}&nbsp;&nbsp;地点:{{$store.state.base.locationDetail.describes}}</b>
              </mu-sub-header>
             <mu-list-item v-for="item,index in $store.state.base.locationDetail.room" :title="'房间名称:'+item.name" :afterText="'设备数量:'+item.deviceGroups.length" :value="index">
              <mu-icon slot="left" value="home"/>
              <mu-divider style="margin-bottom:10px"/>

              <div class="main-machine">
                <img src="http://61.190.61.78:6784/iws/api/img/deviceGroupType01.png">
              </div>
              <mu-divider style="margin-top:10px"/>
           </mu-list-item>
          </mu-list> -->
        </mu-bottom-sheet>
        <!-- <mu-raised-button label="签到" class="record-button" @click="recordWork" primary/> -->
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
  // <!-- <img src="./assets/logo.png"> -->
  data() {
    return {
      sysImg:[],
      mainMap: null,
      sysList: null,
      // locationDetail: null,
      roomBottom: false,
      addressSelect: {
        sys: -1,
        pro: -1,
        city: -1,
        area: -1,
      },
      locationDetail:null,
      markerSelect: "-1",
      center: [117.264595, 31.878641],
      content: '<div style="margin-left:-45px;margin-top:-10px"><div style="text-align:center"><img style="width:35px" src="http://ou1o1z80r.bkt.clouddn.com/main_map_sys.png"><img style="width:20px;position:absolute;left:-10%;top:8%" src="http://218.23.124.104:6784/iws/api/img/system02.png"/></div><div style="width:100px;background-color:white;border:1px #9A2C2C solid;border-radius:4px;padding:2px 5px 2px 5px;text-align:center"><span style="font-size:16px;color:black">测试点</span></div></div>',
    };
  },
  watch: {
    addressSelect: {
      handler(curVal) {
        if (curVal.sys === -1) {
          curVal.pro = -1;
          curVal.city = -1;
          curVal.area = -1;
        }
        if (curVal.pro === -1) {
          curVal.city = -1;
          curVal.area = -1;
        }
        if (curVal.city === -1) {
          curVal.area = -1;
        }
      },
      deep: true,
    },
  },
  created() {
    this.setSysImg();
    this.getSystemList();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //系统
    setSysImg(){
      this.sysImg = []
      for(var i=1;i<9;i++){
        var temp = require('../../assets/system/sys_'+i+'.png')
        this.sysImg.push(temp)
      }
    },
    changeRoomBottom() {
      this.roomBottom = !this.roomBottom;
    },
    recordWork() {
      this.$router.push({ name: 'Record' });
    },
    getSystemList() {
      Indicator.open();
      const self = this;
      this.$store.dispatch(type.SYSTEM_LIST).then((data) => {
        console.log(data.data);
        self.sysList = self.analyseList(data.data.data);
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
    goDataPage(roomSelect, deviceSelect) {
      if (this.$store.state.base.locationDetail.room[roomSelect].device.length > 0) {
        this.$store.commit(type.ROOM_SELECT, { roomSelect, deviceSelect });
        console.log(this.$store.state.base.roomSelect);
        this.$router.push({ name: 'Data' });
      } else {
        this.roomBottom = !this.roomBottom;
        MessageBox('消息', '当前房间暂无设备');
      }
    },
    analyseList(arr) {
      // console.log(arr);
      arr.forEach((system) => {
          system.location.forEach((item) => {
            console.log(item)
              item.content = this.setHtmlContent(this.sysImg[system.pic], item.name.substring(0, 7));
              item.events = {
                click: () => {
                  this.markerSelect = item._id;
                  // Indicator.open();
                  const self = this;
                  this.roomBottom = !this.roomBottom;
                  this.$store.commit(type.LD, item)
                },
              };
          });
      });
      console.log(arr)
      return arr;
    },
    catchError(err) {
      Indicator.close();
      MessageBox('消息', err);
      if (err === '无操作权限') {
        this.$store.commit(type.USER_LOGOUT);
        this.$router.push({ name: 'Login' });
      }
    },
    setHtmlContent(pic, name) {
      const temp1 = `<div style="margin-left:-55px;margin-top:-10px;text-align:center"><div style="text-align:center"><img style="width:35px" src="http://ou1o1z80r.bkt.clouddn.com/main_map_sys.png"><img style="width:20px;position:absolute;left:-10%;top:8%" src="${pic}"/></div>`;
      const temp2 = `<div style="width:120px;background-color:white;border:1px #9A2C2C solid;border-radius:4px;padding:2px 5px 2px 5px;text-align:center"><span style="font-size:14px;color:black">${name}</span></div></div>`;
      return temp1 + temp2;
    },
    changeBottomSheet() {
      this.$store.state.base.bottomSheet = !this.$store.state.base.bottomSheet;
      if (this.addressSelect.sys === -1) {
        this.center = [117.264595, 31.878641];
      } else if (this.sysList[this.addressSelect.sys].locationPack == null) {
        this.center = [117.264595, 31.878641];
      } else {
        const temp = [0, 0, 0];
        if (this.addressSelect.pro !== -1) {
          temp[0] = this.addressSelect.pro;
        }
        if (this.addressSelect.city !== -1) {
          temp[1] = this.addressSelect.city;
        }
        if (this.addressSelect.area !== -1) {
          temp[2] = this.addressSelect.area;
        }
        const temp2 = this.sysList[this.addressSelect.sys].locationPack[temp[0]].city[temp[1]];
        const temp1 = temp2.area[temp[2]].location[0];
        this.center = [temp1.positionX, temp1.positionY];
      }
    },

  },
};
</script>
<style lang="css">
    .main{
        text-align: left;
        height: 100vh;
        width: 100%;
    }
    .amap-wrapper {
      position: fixed;
      width: 100%;
      height: 100%;
    }
    .record-button{
      position: fixed;
      bottom:60px;
    }
    .bottomSheet {
      min-height: 320px;
      padding: 10px 20px;
    }
    .bottom-sheet{
      height: 320px;
      overflow-y: auto;
    }
    .main-machine img {
      width: 100px;
    }
    /*.gridlist {
      height: 80px;
    }*/
    .gridname {
      margin-top: 10px;
      margin-left: 10px;
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: bold;
    }
    .shet-middle {
      min-height: 80px;
      padding-left: 10px;
      padding-right: 10px;
    }
    .shet-title {
      margin:10px 0px 10px 10px;
    }
    .gridcard{
      width: 30%;
      text-align: center;
      /*background-color: rgba(0, 0, 0, 0.1);*/
      border-radius: 5px;
      padding: 5px;
      margin-bottom: 10px;
      box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
      display: inline-block;
      margin-right: 5px
    }
    .gridcard span{
      font-size: 10px;
    }
    .gridlist img {
      height: 80px;
    }
</style>
