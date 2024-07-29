import request from "@/utils/request";
export function addBerita(data) {
  // Buat objek FormData untuk mengirim file
  const formData = new FormData();
  formData.append('idBerita', data.idBerita)
  formData.append('judul', data.judul)
  formData.append('tglPembuatan', data.tglPembuatan)
  formData.append('isiBerita', data.isiBerita)
  formData.append('pembuat', data.pembuat)
  formData.append('file', data.file.file); // 'file' sesuai dengan nama field di backend

  return request({
    url: "/berita",
    method: "post",
    data: formData, // Mengirim FormData dengan file
  });
}

export function getBerita() {
  return request({
    url: "/berita",
    method: "get",
  });
}

export function editBerita(data, idBerita) {
  // Buat objek FormData untuk mengirim file
  const formData = new FormData();
  formData.append('idBerita', data.idBerita)
  formData.append('judul', data.judul)
  formData.append('tglPembuatan', data.tglPembuatan)
  formData.append('isiBerita', data.isiBerita)
  formData.append('pembuat', data.pembuat)
  formData.append('file', data.file.file); // 'file' sesuai dengan nama field di backend

  return request({
    url: `/berita/${idBerita}`,
    method: "put",
    data: formData, // Mengirim FormData dengan file
  });
}

export function deleteBerita(data) {
  return request({
    url: `/berita/${data.idBerita}`,
    method: "delete",
    data,
  });
}
