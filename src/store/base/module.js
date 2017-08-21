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
    state.roomSelect = val;
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
        context.commit(type.USER_LOGIN, data);
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
  [type.LD](context, params) {
    return new Promise((resolve, reject) => {
      api.locationDetail(params)
      .then((data) => {
        context.commit(type.LD, data);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
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
};

export default {
  state: {
    user: null,
    tabbar: 0,
    // systemList: [],
    // newsList: [],
    list: [['修改密码', ''], ['联系地址', ''], ['工作组', '', 'Member']],
    bottomSheet: false,
    tabInfo: [
      { value: 'Main', title: '首页', icon: 'home' },
      { value: 'Alarm', title: '报警', icon: 'notifications_none' },
      { value: 'Task', title: '任务', icon: 'assignment' },
      { value: 'Me', title: '我', icon: 'person' },
    ],
    locationDetail: null,
    roomSelect: null,
  },
  mutations,
  actions,
};
