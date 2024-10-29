import request from "@/utils/request";
export function addJenisHewan(data) {
  // Buat objek FormData untuk mengirim file
  const formData = new FormData();
  formData.append("kodeEartagNasional", data.kodeEartagNasional);
  formData.append("provinsi", data.provinsi);
  formData.append("kabupaten", data.kabupaten);
  formData.append("kecamatan", data.kecamatan);
  formData.append("desa", data.desa);
  formData.append("alamat", data.alamat);
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("peternak_id", data.peternak_id);
  formData.append("kandang_id", data.kandang_id);
  formData.append("jenishewan", data.jenisHewan);
  formData.append("spesies", data.spesies);
  formData.append("sex", data.sex);
  formData.append("jumlah", data.jumlah);
  formData.append("file", data.file.file); // 'file' sesuai dengan nama field di backend

  return request({
    url: "/jenishewan",
    method: "post",
    data: formData, // Mengirim FormData dengan file
  });
}

export function addJenisHewanWithoutFile(data) {
  // Buat objek FormData untuk mengirim file
  const formData = new FormData();
  formData.append("provinsi", data.provinsi);
  formData.append("kabupaten", data.kabupaten);
  formData.append("kecamatan", data.kecamatan);
  formData.append("desa", data.desa);
  formData.append("alamat", data.alamat);
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("peternak_id", data.peternak_id);
  formData.append("kandang_id", data.kandang_id);
  formData.append("jenishewan", data.jenisHewan);
  formData.append("spesies", data.spesies);
  formData.append("sex", data.sex);
  formData.append("jumlah", data.jumlah);

  return request({
    url: "/jenishewan",
    method: "post",
    data: formData,
  });
}

export function getJenisHewan() {
  return request({
    url: "/jenishewan",
    method: "get",
  });
}

export function getJenisHewanByPeternak(peternakID) {
  return request({
    url: "/jenishewan",
    method: "get",
    params: {
      peternakID: peternakID,
    },
  });
}

export function editJenisHewan(data, id) {
  const formData = new FormData();
  formData.append("provinsi", data.provinsi);
  formData.append("kabupaten", data.kabupaten);
  formData.append("kecamatan", data.kecamatan);
  formData.append("desa", data.desa);
  formData.append("alamat", data.alamat);
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("peternak_id", data.peternak_id);
  formData.append("kandang_id", data.kandang_id);
  formData.append("jenishewan", data.jenisHewan);
  formData.append("spesies", data.spesies);
  formData.append("sex", data.sex);
  formData.append("jumlah", data.jumlah);

  return request({
    url: `/jenishewan/${id}`,
    method: "put",
    data: formData,
  });
}

export function deleteJenisHewan(data) {
  return request({
    url: `/jenishewan/${data.kodeEartagNasional}`,
    method: "delete",
    data,
  });
}
