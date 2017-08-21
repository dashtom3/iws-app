// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-light.css';
import VueQrcode from 'vue-qrcode';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import AMap from 'vue-amap';

import App from './App';
import router from './router';
import store from './store/store';

Vue.use(MintUI);
Vue.use(MuseUI);
Vue.use(AMap);
AMap.initAMapApiLoader({
  key: '314fb3788fe20250db6f3d94544cbd6c',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
});

Vue.component('qrcode', VueQrcode);

Vue.filter('arr2string', value => value.join(' / '));
Vue.filter('fixNum', num => (num ? (Number(num).toFixed(1)) : '暂无评分'));

Vue.filter('dateMM', time => `${new Date(parseInt(time, 10)).getMonth() + 1}月`);
Vue.filter('dateDay', time => new Date(parseInt(time, 10)).getDate() + 1);
Vue.filter('dateAll', (time) => {
  if (time == null) {
    return '暂未停止';
  }
  const temp = new Date(parseInt(time, 10));
  return `${temp.getFullYear()}/${temp.getMonth() + 1}/${temp.getDate()} ${temp.getHours()}:${temp.getMinutes()}`;
});
Vue.filter('dateAll2', (time) => {
  if (time == null) {
    return '暂未确认';
  }
  const temp = new Date(parseInt(time, 10));
  return `${temp.getFullYear()}/${temp.getMonth() + 1}/${temp.getDate()} ${temp.getHours()}:${temp.getMinutes()}`;
});
// Vue.filter('subItem', item => item.substring(0, 50));
/* eslint-disable no-new */
window.t = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App,
  },
});
