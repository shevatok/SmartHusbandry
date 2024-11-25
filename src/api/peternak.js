import request from '@/utils/request'

import { v4 as uuidv4 } from 'uuid'

export function addPeternak(data) {
  // Tambahkan idRumpunHewan ke data dengan uuidv4
  const updatedData = {
    ...data,
    idPeternak: uuidv4(),
  }

  return request({
    url: '/peternak',
    method: 'post',
    updatedData,
  })
}

export function getPeternaks() {
  return request({
    url: '/peternak',
    method: 'get',
  })
}

export function editPeternak(data, id) {
  return request({
    url: `/peternak/${id}`,
    method: 'put',
    data,
  })
}

export function deletePeternak(data) {
  return request({
    url: `/peternak/${data.idPeternak}`,
    method: 'delete',
    data,
  })
}
export const getPeternakById = (id) => {
  return request({
    url: `/peternak/${id}`,
    method: 'get',
  })
}

export function addPeternakBulk(data) {
  return request({
    url: '/peternak/bulk',
    method: 'post',
    data,
  })
}
