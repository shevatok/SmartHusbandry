import React, { Component } from "react";
import { Form, Input, Modal, Upload, Select, Icon } from "antd";
import { getPetugas } from "@/api/petugas"; // Import the API function to fetch petugas data
import { getPeternaks } from "@/api/peternak"; 

const { Option } = Select;

class EditDataternakForm extends Component {
  state = {
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
    peternakList: [],
  };

  componentDidMount() {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((provinces) => this.setState({ provinces }));
    this.fetchPeternakList(); 
  }

  fetchPeternakList = async () => {
    try {
      const result = await getPeternaks(); // Fetch peternak data from the server
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const peternakList = content.map((peternak) => ({
          idPeternak: peternak.idPeternak,
          namaPeternak: peternak.namaPeternak
        }));
        this.setState({ peternakList });
      }
    } catch (error) {
      // Handle error if any
      console.error("Error fetching peternak data: ", error);
    }
  };

  handleProvinceChange = (value) => {
    const selectedProvince = this.state.provinces.find((province) => province.name === value);

    if (selectedProvince) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`)
        .then((response) => response.json())
        .then((regencies) => this.setState({ regencies }));
    }

    this.props.form.setFieldsValue({
      kabupaten: undefined,
      kecamatan: undefined,
      desa: undefined,
    });
  };

  handleRegencyChange = (value) => {
    const selectedRegency = this.state.regencies.find((regency) => regency.name === value);

    if (selectedRegency) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`)
        .then((response) => response.json())
        .then((districts) => this.setState({ districts }));
    }

    this.props.form.setFieldsValue({
      kecamatan: undefined,
      desa: undefined,
    });
  };

  handleDistrictChange = (value) => {
    const selectedDistrict = this.state.districts.find((district) => district.name === value);

    if (selectedDistrict) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict.id}.json`)
        .then((response) => response.json())
        .then((villages) => this.setState({ villages }));
    }

    this.props.form.setFieldsValue({
      desa: undefined,
    });
  };
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } =
      this.props;
    const { getFieldDecorator } = form;
    const {
      idKandang,
      peternak,
      luas,
      kapasitas,
      nilaiBangunan,
      alamat,
      provinsi,
      kabupaten,
      kecamatan,
      desa,
    } = currentRowData;
    const { provinces, regencies, districts, villages, peternakList  } = this.state;


    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 19 },
        sm: { span: 17 },
      },
    };
    return (
      <Modal
        title="Edit Data Ternak"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Id Kandang:">
            {getFieldDecorator("idKandang", {
              initialValue: idKandang,
            })(<Input/>)}
          </Form.Item>
          <Form.Item label="Nama Peternak:">
            {getFieldDecorator("peternak_id", {
              initialValue: peternak? peternak.namaPeternak : undefined,
              rules: [
                { required: true, message: "Silahkan isi nama peternak!" },
              ],
            })(
              <Select placeholder="Pilih Nama Peternak">
                {peternakList.map((peternak) => (
                  <Option key={peternak.idPeternak} value={peternak.idPeternak}>
                    {peternak.namaPeternak}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Luas Kandang:">
            {getFieldDecorator("luas", {
              initialValue: luas,
            })(<Input placeholder="Masukkan Luas Kandang" />)}
          </Form.Item>
          <Form.Item label="Kapasitas Kandang:">
            {getFieldDecorator("kapasitas", {
              initialValue: kapasitas,
            })(<Input placeholder="Masukkan Kapasitas Kandang" />)}
          </Form.Item>
          <Form.Item label="Nilai Bangunan:">
            {getFieldDecorator("nilaiBangunan", {
              initialValue: nilaiBangunan,
            })(<Input placeholder="Masukkan Nilai Bangunan" />)}
          </Form.Item>
          <Form.Item label="Alamat:">
            {getFieldDecorator("alamat", {
              initialValue: alamat,
            })(<Input placeholder="Masukkan Alamat" />)}
          </Form.Item>
          <Form.Item label="Provinsi:">
            {getFieldDecorator("provinsi", {
              initialValue: provinsi,
            })(
              <Select placeholder="Masukkan provinsi" onChange={this.handleProvinceChange}>
                {provinces.map((province) => (
                  <Select.Option key={province.id} value={province.name}>
                    {province.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Kabupaten:">
            {getFieldDecorator("kabupaten", {
              initialValue: kabupaten,
            })(
              <Select placeholder="Masukkan kabupaten" onChange={this.handleRegencyChange}>
                {regencies.map((regency) => (
                  <Select.Option key={regency.id} value={regency.name}>
                    {regency.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Kecamatan:">
            {getFieldDecorator("kecamatan", {
              initialValue: kecamatan,
            })(
              <Select placeholder="Masukkan kecamatan" onChange={this.handleDistrictChange}>
                {districts.map((district) => (
                  <Select.Option key={district.id} value={district.name}>
                    {district.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Desa:">
            {getFieldDecorator("desa", {
              initialValue: desa,
            })(
              <Select placeholder="Masukkan Desa">
                {villages.map((village) => (
                  <Select.Option key={village.id} value={village.name}>
                    {village.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Foto Kandang" name="file">
              {getFieldDecorator("file")(
                <Upload.Dragger
                beforeUpload={() => false}
                listType="picture"
              >
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
    );
  }
}

export default Form.create({ name: "EditDataternakForm" })(EditDataternakForm);
