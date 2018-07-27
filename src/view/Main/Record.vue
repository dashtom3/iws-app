<template>
    <div class="record">
        <mu-appbar title="签到">
            <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
            <!-- <mu-flat-button label="我的签到" slot="right" @click="myRecord"/> -->
            <mu-flat-button label="提交" slot="right" @click="signIn"/>
        </mu-appbar>

        <div class="record-content">
            <!-- <mu-select-field v-model="sign.sys"  label="选择系统" fullWidth>
              <mu-menu-item v-for="sys,index in sysList" :key="index" :value="index" :title="sys.name" />
            </mu-select-field>
            <mu-select-field v-model="sign.status"  label="选择地点" fullWidth v-if="sign.sys != null">
              <mu-menu-item v-for="place,index in sysList[sign.sys].place" :key="index" :value="place.id" :title="place.name" />
            </mu-select-field> -->
            <mu-text-field hintText="工作地点" v-model="sign.realAddress" fullWidth /><br/>
            <div class="now-pos">
              <span>当前位置:&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>经度: {{center[0]}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>纬度: {{center[1]}}</span><br>
              <span>所在位置: {{sign.address}}</span>
            </div>
            <div class="map-wrapper">
              <el-amap :vid="'amap-vue'" :zoom="10" :map-manager="mainMap" :plugin="plugin" :center="center">
              </el-amap>
              <!-- <div id="container" ref="map"> -->

              <!-- </div> -->
            </div>
            <mu-text-field hintText="填写人" v-model="sign.userName" fullWidth /><br/>
            <mu-text-field hintText="问题描述" multiLine :rows="2" :rowsMax="6" v-model="sign.problems" fullWidth /><br/>
            <mu-text-field hintText="协调工作" multiLine :rows="2" :rowsMax="6" v-model="sign.teamwork" fullWidth /><br/>
            <mu-text-field hintText="详细描述" multiLine :rows="2" :rowsMax="6" v-model="sign.detailMsg" fullWidth /><br/>
            <!-- <el-upload
            action="http://218.23.124.104:6784/iws/api/file/upload"
            :on-remove="handleRemove"
            :on-success="uploadSucceed"
            :file-list="fileList"
            >
             <el-button size="small" type="primary">图片上传</el-button>
          </el-upload> -->


        </div>
    </div>
</template>

<script>
// import AMap from 'vue-amap';
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
    const self = this;
    return {
      sysList: null,
      addressSelect: {
        sys: null,
        place: null,
      },
      fileList: [],
      sign: {
        teamwork: null,
        problems: null,
        detailMsg: null,
        realAddress:null,
        img: null,
        lng: null,
        lat: null,
        userName: null,
        address: null,
      },
      center: [121.59996, 31.197646],
      mainMap: null,
      plugin: [{
        pName: 'Geolocation',
        events: {
          init(o) {
                // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                self.center = [result.position.lng, result.position.lat];
                self.sign.lng = result.position.lng;
                self.sign.lat = result.position.lat;
                AMap.service('AMap.Geocoder', () => { // 回调函数
                  // 实例化Geocoder
                  const geocoder = new AMap.Geocoder({
                    city: '010', // 城市，默认：“全国”
                  });
                  // TODO: 使用geocoder 对象完成相关功能
                  geocoder.getAddress(self.center, (status1, result1) => {
                    // console.log(status1, result1);
                    if (status1 === 'complete' && result1.info === 'OK') {
                     // 获得了有效的地址信息:
                     // 即，result.regeocode.formattedAddress
                      self.sign.address = result1.regeocode.formattedAddress;
                      console.log(self.sign.address);
                    } else {
                     // 获取地址失败
                    }
                  });
                });
                // self.$nextTick();
              }
            });
          },
        },
      }],
    };
  },
  created() {
    // this.getSystemList();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getSystemList() {
      Indicator.open();
      const self = this;
      this.$store.dispatch(type.SYSTEM_LIST).then((data) => {
        console.log(data.data);
        // self.sysList = data.data;
        self.sysList = self.analyseList(data.data);
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
      this.$router.push({ name: 'RecordList' });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.sign.img = null;
    },
    uploadSucceed(response, file) {
      console.log(response, file);
      this.sign.img = response.data;
      this.fileList = [];
      this.fileList.push({ name: response.data, url: response.data });
    },
    signIn() {
      if ( this.sign.userName != null && this.sign.address != null) {
        Indicator.open();
        const self = this;
        this.$store.dispatch(type.SIGN_IN, this.sign).then((data) => {
          console.log(data.data);
          MessageBox('签到成功！');
          // self.sysList = data.data;
          Indicator.close();
        }).catch((err) => {
          Indicator.close();
          MessageBox('消息', err);
          if (err === '无操作权限') {
            self.$store.commit(type.USER_LOGOUT);
            self.$router.push({ name: 'Login' });
          }
        });
      } else {
        MessageBox('请完善信息');
      }
    },
  },
};
</script>
<style lang="css" scoped>
    .now-pos span {
      color: rgba(0, 0, 0, 0.54);
    }
    .record-content{
      margin-left: 20px;
      margin-right: 20px;
      margin-bottom: 20px;
    }
    .map-wrapper{
      width: 100%;
      height: 100px;
      margin: 10px 0px 10px 0px;
    }
    #container{
  width: 100%;
  height: 100%;
  }
</style>
