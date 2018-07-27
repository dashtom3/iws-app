import * as type from './type';
import * as api from './api';


const mutations = {
  [type.USER_LOGIN](state, login) {
    state.user = login;
    localStorage.setItem('swuser', JSON.stringify(login));
  },
  [type.USER_GET](state) {
    if (state.user == null) {
      state.user = JSON.parse(localStorage.getItem('swuser'));
    }
  },
  [type.USER_ADDRESS](state, user) {
    state.list[1][1] = user.realName;
    state.list[2][1] = user.phone;
    state.list[3][1] = user.address;
  },
  [type.USER_LOGOUT](state) {
    state.user = null;
    localStorage.setItem('swuser', null);
  },
  [type.SYSTEM_LIST](state, list) {
    state.systemList = list;
  },
  [type.LD](state, list) {
    state.locationDetail = list;
  },
  [type.ALERT_TIME](state,time){
    if(state.time){
      clearTimeout(state.time)
    }
    state.time = time
  },
  [type.CLEAR_ALERT_TIME](state,time){
    if(state.time){
      clearTimeout(state.time)
    }
  },
  [type.NEWS_LIST](state, list) {
    state.newsList = list;
  },
  [type.INDICATOR](state, val) {
    state.indicator = val;
  },
  [type.BOTTOMSHEET](state) {
    state.bottomSheet = !state.bottomSheet;
  },
  [type.ROOM_SELECT](state, val) {
    state.roomSelect = val.roomSelect;
    state.deviceSelect = val.deviceSelect;
  },
  [type.TABBAR](state, val) {
    state.tabInfo.forEach((item, index) => {
      if (item.value === val) {
        state.tabbar = index;
      }
    });
  },
};

const actions = {
  [type.USER_LOGIN](context, login) {
    return new Promise((resolve, reject) => {
      api.userLogin(login)
      .then((data) => {
        context.commit(type.USER_LOGIN, data.data);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.USER_UPDATE](context, params) {
    return new Promise((resolve, reject) => {
      api.userUpdate(params)
      .then((data) => {
        // context.commit(type.USER_LOGIN, data.data);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.USER_REGISTER](context, user) {
    return new Promise((resolve, reject) => {
      api.userRegister(user)
      .then(() => {
        // context.commit(type.USER_LOGIN, data);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.USER_VERI](context, username) {
    return new Promise((resolve, reject) => {
      api.userVeriCode(username)
      .then(() => {
        // context.commit(type.USER_LOGIN, data);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.USER_CHANGE_PASS](context, params) {
    return new Promise((resolve, reject) => {
      api.userChangePass(params)
      .then(() => {
        // context.commit(type.USER_LOGIN, data);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.USER_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.userList(params)
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.SYSTEM_LIST]() {
    return new Promise((resolve, reject) => {
      api.systemList()
      .then((data) => {
        // context.commit(type.SYSTEM_LIST, data);
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.NEWS_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.newsList(params)
      .then((data) => {
        // context.commit(type.NEWS_LIST, data);
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.ALARM_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.alarmList(params)
      .then((data) => {
        // context.commit(type.NEWS_LIST, data);
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.REAL_ALARM_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.realAlarmList(params)
      .then((data) => {
        console.log(data)
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.LD](context, params) {
    context.commit(type.LD, params);
  },
  [type.USER_MEMBER]() {
    return new Promise((resolve, reject) => {
      api.userMember()
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.REAL_DATA](context, params) {
    return new Promise((resolve, reject) => {
      api.getRealData(params)
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.DEVICE_DATA_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.deviceDataList(params)
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.DEVICE_CONTROL_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.deviceControlList(params)
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.PUMP_CONTROL](context, params) {
    return new Promise((resolve, reject) => {
      api.changePump(params)
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.SIGN_IN](context, params) {
    return new Promise((resolve, reject) => {
      api.signIn(params)
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.SIGN_IN_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.signInList(params)
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  [type.MAINTAIN_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.maintainList(params)
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};

export default {
  state: {
    user: null,
    tabbar: 0,
    // systemList: [],
    // newsList: [],
    list: [['修改密码', ''], ['真实姓名', ''],['手机号', ''],['联系地址', '']],
    bottomSheet: false,
    tabInfo: [
      { value: 'Main', title: '首页', icon: 'home' },
      { value: 'Alarm', title: '报警', icon: 'notifications_none' },
      // { value: 'Task', title: '任务', icon: 'assignment' },
      // { value: 'Maintain', title: '养护', icon: 'security' },
      { value: 'RecordList', title: '签到',icon:'assignment'},
      { value: 'Me', title: '我', icon: 'person' },
    ],
    time:null,
    locationDetail: null,
    roomSelect: null,
    deviceSelect: null,
  },
  mutations,
  actions,
};
