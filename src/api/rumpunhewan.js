import request from '@/utils/request'

import { v4 as uuidv4 } from 'uuid'

export function addRumpunHewan(data) {
  // Tambahkan idRumpunHewan ke data dengan uuidv4
  const updatedData = {
    ...data,
    idRumpunHewan: uuidv4(),
  }

  return request({
    url: '/rumpunhewan',
    method: 'post',
    data: updatedData,
  })
}

export function getRumpunHewan() {
  return request({
    url: '/rumpunhewan',
    method: 'get',
  })
}

export function editRumpunHewan(data, id) {
  const formData = new FormData()
  formData.append('jenis', data.jenis)
  formData.append('deskripsi', data.deskripsi)

  return request({
    url: `/rumpunhewan/${id}`,
    method: 'put',
    data: formData,
  })
}

export function deleteRumpunHewan(data) {
  return request({
    url: `/rumpunhewan/${data.idRumpunHewan}`,
    method: 'delete',
    data,
  })
}

export function addRumpunHewanImport(data) {
  return request({
    url: '/rumpunhewan',
    method: 'post',
    data: data,
  })
}
