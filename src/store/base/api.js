// import fetch from './../base';
import { get, post, postWithToken, getWithToken } from './../base';

export const MOVIESTYPE = {
  inTheaters: 'in_theaters',
  comingSoon: 'coming_soon',
};

export function fetchMovies(type, { city = '广州', start = 0 } = {}) {
  return get(`movie/${type}`, { city, start });
}
export function fetchMovieSubject(id) {
  return get(`movie/subject/${id}`);
}
export function userLogin(params) {
  return post('user/login', params);
}
export function userRegister(params) {
  return post('user/register', params);
}
export function userVeriCode(params) {
  return post('user/getVerifyCode', params);
}
export function systemList() {
  return postWithToken('system/listPack', null);
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
// export function (username) {
//   return post('user/getVerifyCode', username);
// }
