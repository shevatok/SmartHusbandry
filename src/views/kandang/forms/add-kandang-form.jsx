import React, { Component } from 'react'
import { Form, Input, Modal, Select, Upload, Icon } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getPeternaks } from '@/api/peternak'
import { getKandang } from '@/api/kandang'
import Geocode from 'react-geocode'

const { Option } = Select

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

class AddKandangForm extends Component {
  state = {
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
    peternakList: [],
    mergedLocation: '',
    selectedProvince: '',
    selectedRegency: '',
    selectedDistrict: '',
    selectedVillage: '',
  }

  componentDidMount() {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((response) => response.json())
      .then((provinces) => this.setState({ provinces }))
    this.fetchPeternakList()
  }

  fetchPeternakList = async () => {
    try {
      const result = await getPeternaks() // Fetch peternak data from the server
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        const peternakList = content.map((peternak) => ({
          idPeternak: peternak.idPeternak,
          namaPeternak: peternak.namaPeternak,
          lokasi: peternak.lokasi, // assuming location is in the format "desa, kecamatan, kabupaten, provinsi"
        }))
        this.setState({ peternakList })
      }
    } catch (error) {
      // Handle error if any
      console.error('Error fetching peternak data: ', error)
    }
  }

  handlePeternakChange = async (value) => {
    const selectedPeternak = this.state.peternakList.find(
      (peternak) => peternak.idPeternak === value
    )

    if (selectedPeternak) {
      const lokasi = selectedPeternak.lokasi.split(', ')
      const desa = lokasi[0]
      const kecamatan = lokasi[1]
      const kabupaten = lokasi[2]
      const provinsi = lokasi[3]

      // Set initial values for location fields
      this.setState({
        selectedProvince: provinsi,
        selectedRegency: kabupaten,
        selectedDistrict: kecamatan,
        selectedVillage: desa,
      })

      // Load regions dynamically based on selected location
      await this.setProvince(provinsi)
      await this.setRegency(kabupaten)
      await this.setDistrict(kecamatan)
    }
  }

  setProvince = async (provinceName) => {
    const province = this.state.provinces.find((p) => p.name === provinceName)
    if (province) {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province.id}.json`
      )
      const regencies = await response.json()
      this.setState({ regencies })
    }
  }

  setRegency = async (regencyName) => {
    const regency = this.state.regencies.find((r) => r.name === regencyName)
    if (regency) {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regency.id}.json`
      )
      const districts = await response.json()
      this.setState({ districts })
    }
  }

  setDistrict = async (districtName) => {
    const district = this.state.districts.find((d) => d.name === districtName)
    if (district) {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district.id}.json`
      )
      const villages = await response.json()
      this.setState({ villages })
    }
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
        .then((regencies) => {
          this.setState({
            regencies,
            selectedRegency: '',
            selectedDistrict: '',
            selectedVillage: '',
          })

          this.props.form.setFieldsValue({
            kabupaten: undefined,
            kecamatan: undefined,
            desa: undefined,
          })
        })
        .catch((error) => console.error('Error fetching regencies:', error))
    }
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
        .then((districts) =>
          this.setState({
            districts,
            selectedDistrict: '',
            selectedVillage: '',
          })
        )
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
        .then((villages) => this.setState({ villages, selectedVillage: '' }))
    }

    this.props.form.setFieldsValue({
      desa: undefined,
    })
  }

  handleVillageChange = async (value) => {
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
        alamat: mergedLocation,
      })
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          `${value}, ${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`
        )}&format=json`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]

        this.props.form.setFieldsValue({
          latitude: lat,
          longitude: lon,
        })
      } else {
        console.error('No coordinates found for the provided address.')
      }
    } catch (error) {
      console.error('Error converting address to coordinates: ', error)
    }
  }

  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props
    const { getFieldDecorator } = form
    const {
      provinces,
      regencies,
      districts,
      villages,
      peternakList,
      selectedProvince,
      selectedRegency,
      selectedDistrict,
      selectedVillage,
    } = this.state

    return (
      <Modal
        title="Tambah Data Kandang"
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
          <Form.Item label="Nama Kandang:">
            {getFieldDecorator('namaKandang', {
              rules: [{ required: true, message: 'Masukkan mama kandang!' }],
            })(<Input placeholder="Masukkan nama kandang" />)}
          </Form.Item>
          <Form.Item label="Jenis Kandang:">
            {getFieldDecorator('jenisKandang', {
              initialValue: undefined,
            })(
              <Select
                placeholder="Pilih Jenis Kandang"
                onChange={this.handleProvinceChange}
              >
                <Select.Option key="1" value="permanen">
                  Permanen
                </Select.Option>
                <Select.Option key="2" value="semi permanen">
                  Semi Permanen
                </Select.Option>
                <Select.Option key="3" value="tidak permanen">
                  Tidak Permanen
                </Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Nama Peternak:">
            {getFieldDecorator('peternak_id', {
              rules: [
                { required: true, message: 'Silahkan isi nama peternak!' },
              ],
            })(
              <Select
                placeholder="Pilih Nama Peternak"
                onChange={this.handlePeternakChange}
              >
                {peternakList.map((peternak) => (
                  <Option key={peternak.idPeternak} value={peternak.idPeternak}>
                    {peternak.namaPeternak}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Luas Kandang:">
            {getFieldDecorator('luas', {
              rules: [{ required: true, message: 'Masukkan luas kandang!' }],
            })(<Input placeholder="Masukkan luas kandang" />)}
          </Form.Item>

          <Form.Item label="Jenis Hewan:">
            {getFieldDecorator('jjenis_id ', {
              rules: [{ required: true, message: 'Masukkan Jenis Hewan!' }],
            })(<Input placeholder="Masukkan Jenis Hewan" />)}
          </Form.Item>

          <Form.Item label="Kapasitas Kandang:">
            {getFieldDecorator('kapasitas', {
              rules: [
                { required: true, message: 'Masukkan kapasitas kandang!' },
              ],
            })(<Input placeholder="Masukkan kapasitas kandang" />)}
          </Form.Item>
          <Form.Item label="Nilai Bangunan:">
            {getFieldDecorator('nilaiBangunan', {
              rules: [{ required: true, message: 'Masukkan nilai bangunan!' }],
            })(<Input placeholder="Masukkan nilai bangunan" />)}
          </Form.Item>
          <Form.Item label="Provinsi:">
            {getFieldDecorator('provinsi', {
              initialValue: selectedProvince || undefined,
            })(
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
          <Form.Item label="Kabupaten:">
            {getFieldDecorator('kabupaten', {
              initialValue: selectedRegency || undefined,
            })(
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
          <Form.Item label="Kecamatan:">
            {getFieldDecorator('kecamatan', {
              initialValue: selectedDistrict || undefined,
            })(
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
          <Form.Item label="Desa:">
            {getFieldDecorator('desa', {
              initialValue: selectedVillage || undefined,
            })(
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
          <Form.Item label="Alamat:">
            {getFieldDecorator('alamat', {
              rules: [{ required: true, message: 'Masukkan alamat!' }],
            })(<Input placeholder="Masukkan alamat" />)}
          </Form.Item>
          <Form.Item label="Latitude:">
            {getFieldDecorator('latitude')(
              <Input placeholder="Latitude" disabled />
            )}
          </Form.Item>
          <Form.Item label="Longitude:">
            {getFieldDecorator('longitude')(
              <Input placeholder="Longitude" disabled />
            )}
          </Form.Item>
          <Form.Item label="Foto Kandang" name="file">
            {getFieldDecorator('file')(
              <Upload.Dragger beforeUpload={() => false} listType="picture">
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create({ name: 'AddKandangForm' })(AddKandangForm)
