import request from "@/utils/request";

export function addInseminasi(data) {
  return request({
    url: "/inseminasi",
    method: "post",
    data,
  });
}

export function getInseminasis() {
  return request({
    url: "/inseminasi",
    method: "get",
  });
}

export function getInseminasiByPeternak(peternakID) {
  return request({
    url: "/inseminasi",
    method: "get",
    params:{peternakID:peternakID}
  });
}

export function editInseminasi(data, id) {
  return request({
    url: `/inseminasi/${id}`,
    method: "put",
    data,
  });
}

export function deleteInseminasi(data) {
  return request({
    url: `/inseminasi/${data.idInseminasi}`,
    method: "delete",
    data,
  });
}
