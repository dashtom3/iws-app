// import fetch from './../base';
import { post, postWithToken, getWithToken } from './../base';


export function userLogin(params) {
  return post('user/login', params);
}
export function userRegister(params) {
  return post('user/register', params);
}
export function userUpdate(params) {
  return postWithToken('user/update', params);
}
export function userVeriCode(params) {
  return post('user/getVerifyCode', params);
}
export function userChangePass(params) {
  return postWithToken('user/changePwd', params);
}
export function deviceDetail(params) {
  return getWithToken('room/groupDetail', params);
}
export function changePump(params) {
  return postWithToken('room/manual', params);
}
export function systemList() {
  return postWithToken('system/listPack', null);
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
  return getWithToken('alarm/list', params);
}
export function signIn(params) {
  return postWithToken('signIn/signIn', params);
}
export function signInList(params) {
  return getWithToken('signIn/querySignIn', params);
}
export function maintainList(params) {
  return getWithToken('maintenance/list', params);
}
// export function (username) {
//   return post('user/getVerifyCode', username);
// }
