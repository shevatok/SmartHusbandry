import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  message,
  Upload,
  Row,
  Col,
  Divider,
  Modal,
  Input,
} from 'antd'
import {
  getJenisHewan,
  deleteJenisHewan,
  editJenisHewan,
  addJenisHewan,
} from '@/api/jenishewan'
import { getPetugas } from '@/api/petugas'
import { read, utils } from 'xlsx'
import { UploadOutlined } from '@ant-design/icons'
import AddHewanForm from './forms/add-jenishewan-form'
import EditHewanForm from './forms/edit-jenishewan-form'
import TypingCard from '@/components/TypingCard'
import { reqUserInfo } from '../../api/user'

import { kandangSapi } from '../../assets/images/kandangsapi.jpg'

class JenisHewan extends Component {
  state = {
    petugas: [],
    jenisHewans: [],
    editHewanModalVisible: false,
    editHewanModalLoading: false,
    currentRowData: {},
    addHewanModalVisible: false,
    addHewanModalLoading: false,
    importModalVisible: false,
    importedData: [],
    searchKeyword: '',
    user: null,
  }
  //Fungsi ambil data dari database
  getJenisHewan = async () => {
    const result = await getJenisHewan()
    const { content, statusCode } = result.data

    if (statusCode === 200) {
      const filteredJenisHewan = content.filter((hewan) => {
        const { idJenisHewan, jenis, deskripsi } = hewan
        const keyword = this.state.searchKeyword.toLowerCase()

        const isIdJenisHewanValid = typeof idJenisHewan === 'string'
        const isJenisValid = typeof jenis === 'string'
        const isDeskripsiValid = typeof deskripsi === 'string'

        return (
          (isIdJenisHewanValid &&
            idJenisHewan.toLowerCase().includes(keyword)) ||
          (isJenisValid && jenis.toLowerCase().includes(keyword)) ||
          (isDeskripsiValid && deskripsi.toLowerCase().includes(keyword))
        )
      })

      this.setState({
        jenisHewans: filteredJenisHewan,
      })
    }
  }

  getPetugas = async () => {
    const result = await getPetugas()
    const { content, statusCode } = result.data

    if (statusCode === 200) {
      this.setState({
        petugas: content,
      })
    }
  }

  handleSearch = (keyword) => {
    this.setState(
      {
        searchKeyword: keyword,
      },
      () => {
        this.getJenisHewan()
      }
    )
  }

  //Fungsi Import File Csv
  handleImportModalOpen = () => {
    this.setState({ importModalVisible: true })
  }

  handleImportModalClose = () => {
    this.setState({ importModalVisible: false })
  }

  //Fungsi Edit Hewan
  handleEditHewan = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editHewanModalVisible: true,
    })
  }

  handleEditHewanOk = (_) => {
    const { form } = this.editHewanFormRef.props
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.setState({ editModalLoading: true })
      editJenisHewan(values, values.kodeEartagNasional)
        .then((response) => {
          form.resetFields()
          this.setState({
            editHewanModalVisible: false,
            editHewanModalLoading: false,
          })
          message.success('Berhasil diedit!')
          this.getJenisHewan()
        })
        .catch((e) => {
          message.success('Pengeditan gagal, harap coba lagi!')
        })
    })
  }

  handleDeleteHewan = (row) => {
    const { idJenisHewan } = row

    // Dialog alert hapus data
    Modal.confirm({
      title: 'Konfirmasi',
      content: 'Apakah Anda yakin ingin menghapus data ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Tidak',
      onOk: () => {
        deleteJenisHewan({ idJenisHewan }).then((res) => {
          message.success('Berhasil dihapus')
          this.getJenisHewan()
        })
      },
    })
  }

  handleCancel = (_) => {
    this.setState({
      editHewanModalVisible: false,
      addHewanModalVisible: false,
    })
  }

  //Fungsi Tambahkan Hewan
  handleAddHewan = (row) => {
    this.setState({
      addHewanModalVisible: true,
    })
  }

  handleAddHewanOk = (_) => {
    const { form } = this.addHewanFormRef.props
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.setState({ addHewanModalLoading: true })
      const hewanData = {
        jenis: values.jenis,
        deskripsi: values.deskripsi,
      }
      addJenisHewan(hewanData)
        .then((response) => {
          form.resetFields()
          this.setState({
            addHewanModalVisible: false,
            addHewanModalLoading: false,
          })
          message.success('Berhasil menambahkan!')
          this.getJenisHewan()
        })
        .catch((e) => {
          message.success('Gagal menambahkan, harap coba lagi!')
        })
    })
  }

  componentDidMount() {
    this.getJenisHewan()
    reqUserInfo()
      .then((response) => {
        const user = response.data
        this.setState({ user }, () => {
          this.getJenisHewan()
        })
      })
      .catch((error) => {
        console.error('Terjadi kesalahan saat mengambil data user:', error)
      })
  }

  handleFileImport = (file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = read(data, { type: 'array' })

      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 })

      const importedData = jsonData.slice(1) // Exclude the first row (column titles)

      const columnTitles = jsonData[0] // Assume the first row contains column titles

      // Create column mapping
      const columnMapping = {}
      columnTitles.forEach((title, index) => {
        columnMapping[title] = index
      })

      // Iterate through importedData and process the address
      const modifiedData = importedData.map((row) => {
        const alamatIndex = columnMapping['Alamat Pemilik Ternak**)'] // Adjust this to your actual column name
        let alamat = row[alamatIndex] || '' // Get the alamat value

        // If alamat is empty, combine desa, kecamatan, kabupaten, provinsi
        if (!alamat) {
          const desa = row[columnMapping['Desa']] || ''
          const kecamatan = row[columnMapping['Kecamatan']] || ''
          const kabupaten = row[columnMapping['Kabupaten']] || ''
          const provinsi = row[columnMapping['Provinsi']] || ''
          alamat = `${desa}, ${kecamatan}, ${kabupaten}, ${provinsi}`
        }

        // Split alamat into its parts: dusun, desa, kecamatan, kabupaten, provinsi
        const [dusun, desa, kecamatan, kabupaten, provinsi] = alamat.split(',')

        // Create a new modified row with additional columns
        return {
          ...row,
          dusun,
          desa,
          kecamatan,
          kabupaten,
          provinsi,
          alamat,
        }
      })

      this.setState({
        importedData: modifiedData,
        columnTitles,
        fileName: file.name.toLowerCase(),
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

  convertToJSDate(input) {
    let date
    if (typeof input === 'number') {
      const utcDays = Math.floor(input - 25569)
      const utcValue = utcDays * 86400
      const dateInfo = new Date(utcValue * 1000)
      date = new Date(
        dateInfo.getFullYear(),
        dateInfo.getMonth(),
        dateInfo.getDate()
      ).toString()
    } else if (typeof input === 'string') {
      const [day, month, year] = input.split('/')
      date = new Date(`${year}-${month}-${day}`).toString()
    }

    return date
  }

  fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json`
      )
      const data = await response.json()
      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon }
      } else {
        console.error('No coordinates found for the provided address:', address)
        return { lat: null, lon: null }
      }
    } catch (error) {
      console.error('Error converting address to coordinates:', error)
      return { lat: null, lon: null }
    }
  }

  saveImportedData = async (columnMapping) => {
    const { importedData, jenisHewans, petugas } = this.state
    let errorCount = 0

    try {
      for (const row of importedData) {
        const petugasNama =
          row[columnMapping['Petugas Pendaftar']]?.toLowerCase()
        const petugasData = petugas.find(
          (p) => p.namaPetugas.toLowerCase() === petugasNama
        )
        const petugasId = petugasData ? petugasData.nikPetugas : null
        console.log(
          `Mencocokkan nama petugas: ${petugasNama}, Ditemukan: ${
            petugasData ? 'Ya' : 'Tidak'
          }, petugasId: ${petugasId}`
        )
        const address = `${row[columnMapping['Desa']]}, ${
          row[columnMapping['Kecamatan']]
        }, ${row[columnMapping['Kabupaten']]}, ${
          row[columnMapping['Provinsi']]
        }`
        const { lat, lon } = await this.fetchCoordinates(address)

        const dataToSave = {
          kodeEartagNasional: row[columnMapping['Kode Eartag Nasional']],
          alamat: row.alamat,
          latitude: lat || row[columnMapping['Latitude']],
          longitude: lon || row[columnMapping['Longitude']],
          peternak_id: row[columnMapping['ID Peternak']],
          kandang_id: row[columnMapping['ID Kandang']],
          spesies:
            row[columnMapping['Rumpun Ternak']] ||
            row[columnMapping['Spesies']],
          JenisHewan:
            row[columnMapping['Rumpun Ternak']] ||
            row[columnMapping['jenis Hewan']],

          jumlah:
            row[columnMapping['Jumlah Hewan**']] ||
            row[columnMapping['jumlah']],
          sex:
            row[columnMapping['Jenis Kelamin**']] || row[columnMapping['sex']],

          file: kandangSapi,
        }

        const existingHewanIndex = jenisHewans.findIndex(
          (p) => p.kodeEartagNasional === dataToSave.kodeEartagNasional
        )

        try {
          if (existingHewanIndex > -1) {
            // Update existing data
            await editJenisHewan(dataToSave, dataToSave.kodeEartagNasional)
            this.setState((prevState) => {
              const updatedHewan = [...prevState.jenisHewans]
              updatedHewan[existingHewanIndex] = dataToSave
              return { jenisHewans: updatedHewan }
            })
          } else {
            // Add new data
            await addJenisHewan(dataToSave)
            this.setState((prevState) => ({
              jenisHewans: [...prevState.jenisHewans, dataToSave],
            }))
          }
        } catch (error) {
          errorCount++
          console.error('Gagal menyimpan data:', error)
        }
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`)
      } else {
        message.error(`${errorCount} data gagal disimpan, harap coba lagi!`)
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

  //Fungsi Export dari database ke file csv
  handleExportData = () => {
    const { jenisHewans } = this.state
    const csvContent = this.convertToCSV(jenisHewans)
    this.downloadCSV(csvContent)
  }

  convertToCSV = (data) => {
    const columnTitles = [
      'Kode Eartag Nasional',
      'Nama Peternak',
      'NIK Peternak',
      'Id Kandang',
      'Alamat',
      'Jenis Hewan',
      'Spesies',
      'Jenis Kelamin',
      'Jumlah',
    ]

    const rows = [columnTitles]
    data.forEach((item) => {
      const row = [
        item.kodeEartagNasional,
        item.peternak.namaPeternak,
        item.peternak.nikPeternak,
        item.kandang.idKandang,
        item.alamat,
        item.JenisHewan,
        item.spesies,
        item.Jumlah,
        item.sex,
      ]
      rows.push(row)
    })

    let csvContent = 'data:text/csv;charset=utf-8,'

    rows.forEach((rowArray) => {
      const row = rowArray.join(';')
      csvContent += row + '\r\n'
    })

    return csvContent
  }

  downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'JenisHewan.csv')
    document.body.appendChild(link) // Required for Firefox
    link.click()
  }

  render() {
    const { jenisHewans, importModalVisible, searchKeyword, user } = this.state
    const columns = [
      {
        title: 'Id Jenis Hewan',
        dataIndex: 'idJenisHewan',
        key: 'idJenisHewan',
      },
      { title: 'Jenis', dataIndex: 'jenis', key: 'jenis' },
      { title: 'Deskripsi', dataIndex: 'deskripsi', key: 'deskripsi' },
    ]

    const renderTable = () => {
      if (user && user.role === 'ROLE_PETERNAK') {
        return <Table dataSource={jenisHewans} bordered columns={columns} />
        // eslint-disable-next-line no-mixed-operators
      } else if (
        (user && user.role === 'ROLE_ADMINISTRATOR') ||
        'ROLE_PETUGAS'
      ) {
        return (
          <Table
            dataSource={jenisHewans}
            bordered
            columns={columns && renderColumns()}
          />
        )
      } else {
        return null
      }
    }

    const renderButtons = () => {
      if (
        user &&
        (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')
      ) {
        return (
          <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button type="primary" onClick={this.handleAddHewan}>
                Tambah Jenis Hewan
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button
                icon={<UploadOutlined />}
                onClick={this.handleImportModalOpen}
              >
                Import File
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button icon={<UploadOutlined />} onClick={this.handleExportData}>
                Export File
              </Button>
            </Col>
          </Row>
        )
      } else {
        return null
      }
    }

    const renderColumns = () => {
      // eslint-disable-next-line no-mixed-operators
      if ((user && user.role === 'ROLE_ADMINISTRATOR') || 'ROLE_PETUGAS') {
        columns.push({
          title: 'Operasi',
          key: 'action',
          width: 120,
          align: 'center',
          render: (text, row) => (
            <span>
              <Button
                type="primary"
                shape="circle"
                icon="edit"
                title="Edit"
                onClick={() => this.handleEditHewan(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                title="Delete"
                onClick={() => this.handleDeleteHewan(row)}
              />
            </span>
          ),
        })
      }
      return columns
    }

    const title = (
      <Row gutter={[16, 16]} justify="start">
        {renderButtons()}
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Input
            placeholder="Cari data"
            value={searchKeyword}
            onChange={(e) => this.handleSearch(e.target.value)}
            style={{ width: 235, marginRight: 10 }}
          />
        </Col>
      </Row>
    )

    const cardContent = `Di sini, Anda dapat mengelola  daftar hewan di sistem.`

    return (
      <div className="app-container">
        {/* TypingCard component */}

        <TypingCard title="Manajemen Jenis Hewan" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: 'scroll' }}>
          {renderTable()}
        </Card>

        <EditHewanForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.editHewanFormRef = formRef)}
          visible={this.state.editHewanModalVisible}
          confirmLoading={this.state.editHewanModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditHewanOk}
        />
        <AddHewanForm
          wrappedComponentRef={(formRef) => (this.addHewanFormRef = formRef)}
          visible={this.state.addHewanModalVisible}
          confirmLoading={this.state.addHewanModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddHewanOk}
        />
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

export default JenisHewan
