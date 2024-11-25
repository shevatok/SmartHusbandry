import React, { Component } from 'react'
import { Col, Form, Input, Modal, Row, Select } from 'antd'
import { getPetugas } from '@/api/petugas' // Import the API function to fetch petugas data

const { Option } = Select

class AddPeternakForm extends Component {
  state = {
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
    petugasList: [], // To store the list of petugas names
  }

  componentDidMount() {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((response) => response.json())
      .then((provinces) => this.setState({ provinces }))
    this.fetchPetugasList()
  }

  handleProvinceChange = (value) => {
    const selectedProvince = this.state.provinces.find(
      (province) => province.name === value
    )

    if (selectedProvince) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`
      )
        .then((response) => response.json())
        .then((regencies) => this.setState({ regencies }))
    }

    this.props.form.setFieldsValue({
      kabupaten: undefined,
      kecamatan: undefined,
      desa: undefined,
    })
  }

  handleRegencyChange = (value) => {
    const selectedRegency = this.state.regencies.find(
      (regency) => regency.name === value
    )

    if (selectedRegency) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`
      )
        .then((response) => response.json())
        .then((districts) => this.setState({ districts }))
    }

    this.props.form.setFieldsValue({
      kecamatan: undefined,
      desa: undefined,
    })
  }

  handleDistrictChange = (value) => {
    const selectedDistrict = this.state.districts.find(
      (district) => district.name === value
    )

    if (selectedDistrict) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict.id}.json`
      )
        .then((response) => response.json())
        .then((villages) => this.setState({ villages }))
    }

    this.props.form.setFieldsValue({
      desa: undefined,
    })
  }

  handleVillageChange = (value) => {
    const { provinces, regencies, districts, villages } = this.state
    const selectedProvince = provinces.find(
      (province) => province.name === this.props.form.getFieldValue('provinsi')
    )
    const selectedRegency = regencies.find(
      (regency) => regency.name === this.props.form.getFieldValue('kabupaten')
    )
    const selectedDistrict = districts.find(
      (district) => district.name === this.props.form.getFieldValue('kecamatan')
    )
    const selectedVillage = villages.find((village) => village.name === value)

    if (
      selectedProvince &&
      selectedRegency &&
      selectedDistrict &&
      selectedVillage
    ) {
      const mergedLocation = `${selectedVillage.name}, ${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`
      this.setState({ mergedLocation })
      this.props.form.setFieldsValue({
        lokasi: mergedLocation,
      })
    }
  }

  fetchPetugasList = async () => {
    try {
      const result = await getPetugas() // Fetch petugas data from the server
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        // Extract petugas names and nikPetugas
        const petugasList = content.map((petugas) => ({
          nikPetugas: petugas.nikPetugas,
          namaPetugas: petugas.namaPetugas,
        }))
        this.setState({ petugasList })
      }
    } catch (error) {
      // Handle error if any
      console.error('Error fetching petugas data: ', error)
    }
  }

  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      selectedPetugasData,
    } = this.props
    const { provinces, regencies, districts, villages } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const { petugasList } = this.state

    return (
      <Modal
        title="Tambah Data Pemilik Ternak"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={1000}
      >
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              {' '}
              <Form.Item label="Nama Peternak:">
                {getFieldDecorator('namaPeternak', {
                  rules: [
                    { required: true, message: 'Silahkan isi nama peternak' },
                  ],
                })(<Input placeholder="Masukkan Nama Peternak" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="NIK Peternak:">
                {getFieldDecorator('nikPeternak', {
                  rules: [
                    { required: true, message: 'Silahkan isi NIK Peternak' },
                  ],
                })(<Input placeholder="Masukkan NIK Peternak" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Provinsi:">
                {getFieldDecorator('provinsi')(
                  <Select
                    placeholder="Masukkan provinsi"
                    onChange={this.handleProvinceChange}
                  >
                    {provinces.map((province) => (
                      <Select.Option key={province.id} value={province.name}>
                        {province.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Kabupaten:">
                {getFieldDecorator('kabupaten')(
                  <Select
                    placeholder="Masukkan kabupaten"
                    onChange={this.handleRegencyChange}
                  >
                    {regencies.map((regency) => (
                      <Select.Option key={regency.id} value={regency.name}>
                        {regency.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Kecamatan:">
                {getFieldDecorator('kecamatan')(
                  <Select
                    placeholder="Masukkan kecamatan"
                    onChange={this.handleDistrictChange}
                  >
                    {districts.map((district) => (
                      <Select.Option key={district.id} value={district.name}>
                        {district.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Desa:">
                {getFieldDecorator('desa')(
                  <Select
                    placeholder="Masukkan Desa"
                    onChange={this.handleVillageChange}
                  >
                    {villages.map((village) => (
                      <Select.Option key={village.id} value={village.name}>
                        {village.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Dusun:">
                {getFieldDecorator('dusun', {
                  rules: [{ required: true, message: 'Silahkan isi dusun' }],
                })(<Input placeholder="Masukkan dusun" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Lokasi:">
                {getFieldDecorator('lokasi', {
                  rules: [{ required: true, message: 'Silahkan isi lokasi' }],
                })(<Input placeholder="Lokasi akan otomatis terisi" />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Alamat:">
                {getFieldDecorator('alamat', {
                  rules: [{ required: true, message: 'Silahkan isi alamat' }],
                })(<Input placeholder="Masukkan alamat" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Latitude:">
                {getFieldDecorator('latitude', {
                  rules: [{ required: true, message: 'Silahkan isi latitude' }],
                })(<Input placeholder="Masukkan Latitude" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Longitude:">
                {getFieldDecorator('longitude', {
                  rules: [
                    { required: true, message: 'Silahkan isi longitude' },
                  ],
                })(<Input placeholder="Masukkan Longitude" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Petugas Pendaftar:">
                {getFieldDecorator('petugas_id', {
                  rules: [
                    {
                      required: true,
                      message: 'Silahkan isi petugas pendaftar',
                    },
                  ],
                })(
                  <Select placeholder="Pilih Petugas Pendaftar">
                    {petugasList.map((petugas) => (
                      <Option
                        key={petugas.nikPetugas}
                        value={petugas.nikPetugas}
                      >
                        {petugas.namaPetugas}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tanggal Pendaftaran:">
                {getFieldDecorator('tanggalPendaftaran', {
                  rules: [
                    { required: true, message: 'Silahkan tanggal pendaftaran' },
                  ],
                })(
                  <Input
                    type="date"
                    placeholder="Masukkan Tanggal Pendaftaran"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default Form.create({ name: 'AddPeternakForm' })(AddPeternakForm)
