import request from '@/utils/request'

export function addPetugas(data) {
  return request({
    url: '/petugas',
    method: 'post',
    data,
  })
}

export function getPetugas() {
  return request({
    url: '/petugas',
    method: 'get',
  })
}

export function editPetugas(data, nikPetugas) {
  return request({
    url: `/petugas/${nikPetugas}`,
    method: 'put',
    data,
  })
}

export function deletePetugas(data) {
  return request({
    url: `/petugas/${data.nikPetugas}`,
    method: 'delete',
    data,
  })
}

export function addPetugasBulk(data) {
  return request({
    url: '/petugas/bulk',
    method: 'post',
    data,
  })
}