import axios from 'axios';

const HOST = 'http://localhost:6784/';

export default function (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(HOST + url, { params })
      .then((res) => {
        resolve(res.data);
      }).catch(err => reject(err));
  });
}
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(HOST + url, { params })
      .then((res) => {
        resolve(res.data);
      }).catch(err => reject(err));
  });
}
export function getWithToken(url, params) {
  url = url +"?token="+ JSON.parse(localStorage.getItem('swuser')).token;
  return new Promise((resolve, reject) => {
    axios.get(HOST + url, { params })
      .then((res) => {
        console.log(res.data)
        if (res.data.status === 1) {
          resolve(res.data);
        } else {
          reject(res.data.message);
        }
      }).catch(() => {
        reject('网络请求错误');
      },
      );
  });
}
export function postWithToken(url, params) {
  return new Promise((resolve, reject) => {
    const temp = new FormData();
    if (params != null) {
      Object.entries(params).forEach((item) => {
        if (item[1] != null) {
          temp.append(item[0], item[1]);
        }
      });
    }
    temp.append('token', JSON.parse(localStorage.getItem('swuser')).token);
    axios.post(HOST + url, temp)
      .then((res) => {
        if (res.data.status === 1) {
          resolve(res.data);
        } else {
          reject(res.data.message);
        }
      }).catch(() => {
        // reject(err);
        reject('网络请求错误');
      });
  });
}
export function post(url, params) {
  return new Promise((resolve, reject) => {
    const temp = new FormData();
    Object.entries(params).forEach((item) => {
      if (item[1] != null) {
        temp.append(item[0], item[1]);
      }
    });
    axios.post(HOST + url, temp)
      .then((res) => {
        // console.log(res)
        if (res.data.status === 1) {
          resolve(res.data);
        } else {
          reject(res.data.message);
        }
      }).catch(() => {
        // reject(err);
        reject('网络请求错误');
      });
  });
}
