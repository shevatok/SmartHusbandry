import React, { Component } from 'react'
import { Form, Input, Modal, Select } from 'antd'

class AddPetugasForm extends Component {
  state = {
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
  }

  componentDidMount() {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((response) => response.json())
      .then((provinces) => this.setState({ provinces }))
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
    })
  }

  handleDistrictChange = (value) => {
    const { provinces, regencies, districts, villages } = this.state
    const selectedProvince = provinces.find(
      (province) => province.name === this.props.form.getFieldValue('provinsi')
    )
    const selectedRegency = regencies.find(
      (regency) => regency.name === this.props.form.getFieldValue('kabupaten')
    )
    const selectedDistrict = this.state.districts.find(
      (district) => district.name === value
    )

    if (selectedProvince && selectedRegency && selectedDistrict) {
      const mergedLocation = `${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`
      this.setState({ mergedLocation })
      this.props.form.setFieldsValue({
        wilayah: mergedLocation,
      })
    }
  }

  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props
    const { provinces, regencies, districts } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 19 },
        sm: { span: 17 },
      },
    }
    return (
      <Modal
        title="Tambah Data Petugas"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item label="NIK Petugas:">
            {getFieldDecorator('nikPetugas', {
              rules: [{ required: true, message: 'Masukkan nik petugas!' }],
            })(<Input placeholder="Masukkan nik petugas" />)}
          </Form.Item>
          <Form.Item label="Nama Petugas:">
            {getFieldDecorator('namaPetugas', {
              rules: [{ required: true, message: 'Masukkan nama petugas!' }],
            })(<Input placeholder="Masukkan nama petugas" />)}
          </Form.Item>
          <Form.Item label="No Telepon Petugas:">
            {getFieldDecorator(
              'noTelp',
              {}
            )(<Input placeholder="Masukkan Telepon Petugas" />)}
          </Form.Item>
          <Form.Item label="Email Petugas:">
            {getFieldDecorator(
              'email',
              {}
            )(<Input placeholder="Masukkan Email Petugas" />)}
          </Form.Item>
          <Form.Item label="Provinsi:">
            {getFieldDecorator('provinsi')(
              <Select
                placeholder="Pilih provinsi"
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
          <Form.Item label="Kabupaten:">
            {getFieldDecorator('kabupaten')(
              <Select
                placeholder="Pilih kabupaten"
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
          <Form.Item label="Kecamatan:">
            {getFieldDecorator('kecamatan')(
              <Select
                placeholder="Pilih kecamatan"
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
          <Form.Item label="Wilayah:">
            {getFieldDecorator('wilayah', {
              rules: [{ required: true, message: 'ini akan terisi otomatis' }],
            })(<Input placeholder="Wilayah akan otomatis terisi" />)}
          </Form.Item>

          <Form.Item label="Pekerjaan:">
            {getFieldDecorator('job')(
              <Select
                placeholder="Pilih pekerjaan"
                onChange={this.handleDistrictChange}
              >
                <Select.Option key={1} value={'pendataan'}>
                  Pendataan
                </Select.Option>
                <Select.Option key={2} value={'vaksinasi'}>
                  Vaksinasi
                </Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create({ name: 'AddPetugasForm' })(AddPetugasForm)
