import request from "@/utils/request";

export function addPkb(data) {
  return request({
    url: "/pkb",
    method: "post",
    data,
  });
}

export function getPkb() {
  return request({
    url: "/pkb",
    method: "get",
  });
}

export function getPkbByPeternak(peternakID) {
  return request({
    url: "/pkb",
    method: "get",
    params:{peternakID:peternakID}
  });
}

export function editPkb(data, id) {
  return request({
    url: `/pkb/${id}`,
    method: "put",
    data,
  });
}

export function deletePkb(data) {
  return request({
    url: `/pkb/${data.idKejadian}`,
    method: "delete",
    data,
  });
}
