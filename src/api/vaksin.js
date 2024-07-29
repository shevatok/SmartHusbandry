import request from "@/utils/request";

export function addVaksin(data) {
  return request({
    url: "/vaksin",
    method: "post",
    data,
  });
}

export function getVaksins() {
  return request({
    url: "/vaksin",
    method: "get",
  });
}

export function getVaksinByPeternak(peternakID) {
  return request({
    url: "/vaksin",
    method: "get",
    params: {peternakID : peternakID}
  });
}

export function editVaksin(data, id) {
  return request({
    url: `/vaksin/${id}`,
    method: "put",
    data,
  });
}

export function deleteVaksin(data) {
  return request({
    url: `/vaksin/${data.idVaksin}`,
    method: "delete",
    data,
  });
}
