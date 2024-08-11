import request from "@/utils/request";

export function reqUserInfo(data) {
  return request({
    url: "/user/me",
    method: "get",
    data,
  });
}

export function getUsers() {
  return request({
    url: "/user/list",
    method: "get",
  });
}

export function getUserByUsername(username) {
  return request({
    url: `/user/${username}`,
    method: "get",
  });
}

export function deleteUser(data) {
  return request({
    url: `/user/${data.id}`,
    method: "delete",
  });
}

export function editUser(data) {
  return request({
    url: "/user/edit",
    method: "post",
    data,
  });
}

export function reqValidatUserID(data) {
  return request({
    url: "/user/validatUserID",
    method: "post",
    data,
  });
}

export function addUser(data) {
  return request({
    url: "/user/add",
    method: "post",
    data,
  });
}

export function register(data) {
  return request({
    url: "/auth/signup",
    method: "post",
    data,
  });
}

