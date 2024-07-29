import request from "@/utils/request";
export function addKandang(data) {
  // Buat objek FormData untuk mengirim file
  const formData = new FormData();
  formData.append('idKandang', data.idKandang)
  formData.append('peternak_id', data.peternak_id)
  formData.append('luas', data.luas)
  formData.append('kapasitas', data.kapasitas)
  formData.append('nilaiBangunan', data.nilaiBangunan)
  formData.append('alamat', data.alamat)
  formData.append('latitude', data.latitude)
  formData.append('longitude', data.longitude)
  formData.append('file', data.file.file); // 'file' sesuai dengan nama field di backend

  return request({
    url: "/kandang",
    method: "post",
    data: formData, 
  });
}

export function addKandangWithoutFile(data) {
  const formData = new FormData();
  formData.append('idKandang', data.idKandang)
  formData.append('peternak_id', data.peternak_id)
  formData.append('luas', data.luas)
  formData.append('kapasitas', data.kapasitas)
  formData.append('nilaiBangunan', data.nilaiBangunan)
  formData.append('alamat', data.alamat)
  formData.append('latitude', data.latitude)
  formData.append('longitude', data.longitude)

  return request({
    url: "/kandang",
    method: "post",
    data: formData,
  });
}

export function editKandang(data, id) {
  const formData = new FormData();
  formData.append('idKandang', data.idKandang)
  formData.append('peternak_id', data.peternak_id)
  formData.append('luas', data.luas)
  formData.append('kapasitas', data.kapasitas)
  formData.append('nilaiBangunan', data.nilaiBangunan)
  formData.append('alamat', data.alamat)
  formData.append('latitude', data.latitude)
  formData.append('longitude', data.longitude)
  formData.append('file', data.file.file);

  return request({
    url: `/kandang/${id}`,
    method: "put",
    data: formData,
  });
}

export function getKandang() {
  return request({
    url: "/kandang",
    method: "get",
  });
}

export function getKandangByPeternak(peternakID) {
  return request({
    url: "/kandang", 
    method: "get",
    params: {
      peternakID: peternakID
    },
  });
}

export function deleteKandang(data) {
  return request({
    url: `/kandang/${data.idKandang}`,
    method: "delete",
    data,
  });
}
