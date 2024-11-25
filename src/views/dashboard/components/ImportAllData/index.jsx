import React, { Component } from 'react'
import { Button, message, Upload, Modal } from 'antd'
import { read, utils } from 'xlsx'
import { UploadOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import { addPetugasBulk } from '@/api/petugas'
import { addPeternakBulk } from '@/api/peternak'

export const sendPetugasBulkData = async (data, batchSize = 100) => {
  const totalBatches = Math.ceil(data.length / batchSize)

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize)

    try {
      const response = await addPetugasBulk(batchData)
      console.log(
        `Batch ${i + 1}/${totalBatches} berhasil dikirim`,
        response.data
      )
    } catch (error) {
      console.error(
        `Batch ${i + 1}/${totalBatches} gagal dikirim`,
        error.response?.data || error.message
      )
      throw error // Hentikan proses jika batch gagal
    }
  }
}

export const sendPeternakBulkData = async (data, batchSize = 100) => {
  const totalBatches = Math.ceil(data.length / batchSize)

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize)

    try {
      const response = await addPeternakBulk(batchData)
      console.log(
        `Batch ${i + 1}/${totalBatches} berhasil dikirim`,
        response.data
      )
    } catch (error) {
      console.error(
        `Batch ${i + 1}/${totalBatches} gagal dikirim`,
        error.response?.data || error.message
      )
      throw error // Hentikan proses jika batch gagal
    }
  }
}

const getValidData = (row, columnMapping, columnKey) => {
  return row[columnMapping[columnKey]] == null
    ? '-'
    : row[columnMapping[columnKey]]
}

export default class ImportAllData extends Component {
  state = {
    importedData: [],
    importModalVisible: false,
  }

  handleImportModalOpen = () => {
    this.setState({ importModalVisible: true })
  }

  handleImportModalClose = () => {
    this.setState({ importModalVisible: false })
  }

  handleFileImport = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = read(data, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]

      // Set defval to null so empty cells are not skipped
      const jsonData = utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
        defval: null,
      })
      const importedData = jsonData.slice(1) // Exclude the first row (column titles)
      const columnTitles = jsonData[0] // Assume the first row contains column titles
      const fileName = file.name.toLowerCase()

      const columnMapping = {}
      columnTitles.forEach((title, index) => {
        columnMapping[title] = index
      })

      this.setState({
        importedData,
        columnTitles,
        fileName,
        columnMapping,
      })
    }
    reader.readAsArrayBuffer(file)
  }

  handleUpload = () => {
    const { importedData, columnMapping } = this.state

    if (importedData.length === 0) {
      message.error('No data to import.')
      return
    }

    this.setState({ uploading: true })

    this.saveImportedData(columnMapping)
      .then(() => {
        this.setState({
          uploading: false,
          importModalVisible: false,
        })
      })
      .catch((error) => {
        console.error('Gagal mengunggah data:', error)
        this.setState({ uploading: false })
        message.error('Gagal mengunggah data, harap coba lagi.')
      })
  }

  saveImportedData = async (columnMapping) => {
    const { importedData, petugas } = this.state
    let errorCount = 0

    // console.log(importedData)

    try {
      const petugasPendataanBulk = []
      const petugasVaksinasiBulk = []
      const peternakBulk = []
      const jenisHewanBulk = []
      const rumpunHewanBulk = []
      const kandangBulk = []
      const ternakBulk = []
      const vaksinBulk = []

      for (const row of importedData) {
        const generateIdPeternak = uuidv4()
        const generateIdJenisHewan = uuidv4()
        const generateIdRumpunHewan = uuidv4()
        const generateIdKandang = uuidv4()
        const generateIdHewan = uuidv4()
        const generateIdVaksin = uuidv4()

        const dataPetugasPendataan = {
          nikPetugas: getValidData(
            row,
            columnMapping,
            'NIK Petugas Pendataan*)'
          ),
          namaPetugas: getValidData(
            row,
            columnMapping,
            'Nama Petugas Pendataan*)'
          ),
          noTelp: getValidData(
            row,
            columnMapping,
            'No. Telp Petugas Pendataan*)'
          ),
          email: getValidData(row, columnMapping, 'Email Petugas Pendataan*)'),
          job: 'Pendataan',
        }

        const dataPetugasVaksinasi = {
          nikPetugas: getValidData(
            row,
            columnMapping,
            'NIK Petugas Vaksinasi*)'
          ),
          namaPetugas: getValidData(
            row,
            columnMapping,
            'Nama Petugas Vaksinasi*)'
          ),
          noTelp: getValidData(
            row,
            columnMapping,
            'No. Telp Petugas Vaksinasi*)'
          ),
          email: getValidData(row, columnMapping, 'Email Petugas Vaksinasi*)'),
          job: 'Vaksinasi',
        }

        const dataPeternak = {
          idPeternak: generateIdPeternak,
          nikPeternak: getValidData(row, columnMapping, 'NIK Pemilik Ternak*)'),
          namaPeternak: getValidData(
            row,
            columnMapping,
            'Nama Pemilik Ternak*)'
          ),
          lokasi: getValidData(row, columnMapping, 'Alamat Pemilik Ternak*)'),
          petugas_id: getValidData(
            row,
            columnMapping,
            'NIK Petugas Pendataan*)'
          ),
          noTelepon: getValidData(
            row,
            columnMapping,
            'No Telp. Pemilik Ternak*)'
          ),
          email: getValidData(row, columnMapping, 'Email Pemilik Ternak*)'),
          jenisKelamin: getValidData(
            row,
            columnMapping,
            'Jenis Kelamin Pemilik Ternak*)'
          ),
          tanggalLahir: getValidData(
            row,
            columnMapping,
            'Tanggal Lahir Pemilik Ternak*)'
          ),
          idIsikhnas: getValidData(row, columnMapping, 'ID isikhnas Pemilik*)'),
        }

        console.log(dataPeternak)

        const dataJenisHewan = {
          idJenisHewan: generateIdJenisHewan,
          jenis: getValidData(row, columnMapping, 'Jenis Ternak*)'),
          deskripsi:
            'Deskripsi ' + getValidData(row, columnMapping, 'Jenis Ternak*)'),
        }

        const dataRumpunHewan = {
          idRumpunHewan: generateIdRumpunHewan,
          rumpun: getValidData(row, columnMapping, 'Rumpun Ternak*)'),
          deskripsi:
            'Deskripsi ' + getValidData(row, columnMapping, 'Rumpun Ternak*)'),
        }

        const dataKandang = {
          idKandang: generateIdKandang,
          peternak_id: generateIdPeternak,
          jenisHewanId: generateIdJenisHewan,
          alamat: getValidData(row, columnMapping, 'Alamat Kandang*)'),
        }

        const dataTernak = {
          idHewan: generateIdHewan,
          kodeEartagNasional: getValidData(row, columnMapping, 'No. Eartag*)'),
          alamat: getValidData(row, columnMapping, 'Alamat Kandang*)'),
          petugas_id: getValidData(
            row,
            columnMapping,
            'NIK Petugas Pendataan*)'
          ),
          peternak_id: generateIdPeternak,
          kandang_id: generateIdKandang,
          jenisHewanId: generateIdJenisHewan,
          rumpunHewanId: generateIdRumpunHewan,
        }

        const dataVaksin = {
          idVaksin: generateIdVaksin,
          peternak_id: generateIdPeternak,
          hewan_id: generateIdHewan,
          petugas_id: getValidData(
            row,
            columnMapping,
            'NIK Petugas Vaksinasi*)'
          ),
          namaVaksin: getValidData(row, columnMapping, 'Nama Vaksin*)'),
          jenisVaksin: getValidData(row, columnMapping, 'Jenis Vaksin*)'),
          tglVaksin: getValidData(row, columnMapping, 'Tanggal Vaksin*)'),
        }

        // Add data to bulk arrays
        petugasPendataanBulk.push(dataPetugasPendataan)
        petugasVaksinasiBulk.push(dataPetugasVaksinasi)
        peternakBulk.push(dataPeternak)
        jenisHewanBulk.push(dataJenisHewan)
        rumpunHewanBulk.push(dataRumpunHewan)
        kandangBulk.push(dataKandang)
        ternakBulk.push(dataTernak)
        vaksinBulk.push(dataVaksin)
      }

      // Send bulk data to server
      try {
        await sendPetugasBulkData(petugasPendataanBulk)
        await sendPetugasBulkData(petugasVaksinasiBulk)
        await sendPeternakBulkData(peternakBulk)
        // await sendPeternakImport(peternakBulk)
        // await sendJenisHewanImport(jenisHewanBulk)
        // await sendRumpunHewanImport(rumpunHewanBulk)
        // await sendKandangImport(kandangBulk)
        // await sendHewanImport(ternakBulk)
        // await sendVaksinImport(vaksinBulk)
      } catch (error) {
        console.error('Gagal menyimpan data secara bulk:', error)
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`)
      } else {
        message.error(
          `${errorCount} data gagal disimpan karena duplikasi data!`
        )
      }
    } catch (error) {
      console.error('Gagal memproses data:', error)
    } finally {
      this.setState({
        importedData: [],
        columnTitles: [],
        columnMapping: {},
      })
    }
  }

  render() {
    const { importModalVisible } = this.state
    return (
      <div style={{ marginBottom: '1rem' }}>
        <Button icon={<UploadOutlined />} onClick={this.handleImportModalOpen}>
          Import File
        </Button>
        <Modal
          title="Import File"
          visible={importModalVisible}
          onCancel={this.handleImportModalClose}
          footer={[
            <Button key="cancel" onClick={this.handleImportModalClose}>
              Cancel
            </Button>,
            <Button
              key="upload"
              type="primary"
              loading={this.state.uploading}
              onClick={this.handleUpload}
            >
              Upload
            </Button>,
          ]}
        >
          <Upload beforeUpload={this.handleFileImport}>
            <Button icon={<UploadOutlined />}>Pilih File</Button>
          </Upload>
        </Modal>
      </div>
    )
  }
}
