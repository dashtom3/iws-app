// import fetch from './../base';
import { post, postWithToken, getWithToken } from './../base';


export function userLogin(params) {
  return post('user/login', params);
}
export function userRegister(params) {
  return post('user/register', params);
}
export function userUpdate(params) {
  return postWithToken('user/update/'+params._id, params);
}
export function userList(params) {
  return getWithToken('user/all', params);
}
export function userVeriCode(params) {
  return post('user/getVerifyCode', params);
}
export function userChangePass(params) {
  return postWithToken('user/changePassword', params);
}
export function getRealData(params) {
  return getWithToken('data/realData/'+params._id, null);
}
export function changePump(params) {
  return postWithToken('room/manual', params);
}
export function systemList() {
  return getWithToken('system/system/all', null);
}
export function deviceDataList(params) {
  return getWithToken('data/presentData', params);
}
export function deviceControlList(params) {
  return getWithToken('data/pumpStatus', params);
}
export function newsList(params) {
  return getWithToken('news/list', params);
}
export function userMember() {
  return getWithToken('user/getGroupMember', {});
}
export function locationDetail(params) {
  return postWithToken('location/detail', params);
}
export function alarmList(params) {
  return getWithToken('data/historyAlarmData', params);
}
export function realAlarmList(params) {
  return getWithToken('data/realAlarmData', {isMe:'1'});
}
export function signIn(params) {
  return postWithToken('work/sign/add', params);
}
export function signInList(params) {
  return getWithToken('work/sign/all', params);
}
export function maintainList(params) {
  return getWithToken('maintenance/list', params);
}
// export function (username) {
//   return post('user/getVerifyCode', username);
// }
