import React, { Component } from "react";
import { Form, Input, Modal, Select, Upload, Icon } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak"; 
import {getKandang} from "@/api/kandang";

const { Option } = Select;

class AddHewanForm extends Component {
  state = {
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
    kandangList: [],
    petugasList: [],
    peternakList: [],
  };

  componentDidMount() {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((provinces) => this.setState({ provinces }));
    this.fetchPetugasList();
    this.fetchPeternakList();
    this.fetchKandangList();
  }

  fetchPetugasList = async () => {
    try {
      const result = await getPetugas(); // Fetch petugas data from the server
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        // Extract petugas names and nikPetugas
        const petugasList = content.map((petugas) => ({
          nikPetugas: petugas.nikPetugas,
          namaPetugas: petugas.namaPetugas
        }));
        this.setState({ petugasList });
      }
    } catch (error) {
      // Handle error if any
      console.error("Error fetching petugas data: ", error);
    }
  };

  fetchKandangList = async () => {
    try {
      const result = await getKandang(); // Fetch kandang data from the server
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({
          kandangList: content.map((kandang) => kandang.idKandang), // Extract kandang id
        });
      }
    } catch (error) {
      // Handle error if any
      console.error("Error fetching kandang data: ", error);
    }
  };

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

  handleVillageChange = async (value) => {
    const { provinces, regencies, districts, villages } = this.state;
    const selectedProvince = provinces.find((province) => province.name === this.props.form.getFieldValue("provinsi"));
    const selectedRegency = regencies.find((regency) => regency.name === this.props.form.getFieldValue("kabupaten"));
    const selectedDistrict = districts.find((district) => district.name === this.props.form.getFieldValue("kecamatan"));
    const selectedVillage = villages.find((village) => village.name === value);

    if (selectedProvince && selectedRegency && selectedDistrict && selectedVillage) {
      const mergedLocation = `${selectedVillage.name}, ${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`;
      this.setState({ mergedLocation });
      this.props.form.setFieldsValue({
        alamat: mergedLocation,
      });
    }

    const alamat = this.props.form.getFieldValue("alamat");
    const prov = selectedProvince ? selectedProvince.name : '';
    const kab = selectedRegency ? selectedRegency.name : '';
    const kec = selectedDistrict ? selectedDistrict.name : '';
    const desa = selectedVillage ? selectedVillage.name : '';
    
    console.log(alamat); 
    
    console.log(prov);

    console.log(desa);

    try {
      const response = await 
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${kec}, ${desa}`)}&format=json`);
      const data = await response.json();
      console.log(data);

      if (data && data.length > 0) {
        const { lat, lon } = data[0]; // Ambil latitude dan longitude dari respons OSM

        this.props.form.setFieldsValue({
          latitude: lat,
          longitude: lon,
        });
      } else {
        console.error("No coordinates found for the provided address.");
      }
    } catch (error) {
      console.error("Error converting address to coordinates: ", error);
    }
  };
  
  
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const { 
      provinces, 
      regencies, 
      districts, 
      villages, 
      kandangList,
      petugasList, 
      peternakList,
    } = this.state;
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
        title="Tambah Data Ternak"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Kode Eartag Nasional:">
            {getFieldDecorator(
              "kodeEartagNasional",
              {rules: [{ required: true, message: "Masukkan Kode Eartag Nasional!" }],}
            )(<Input placeholder="Masukkan kode" />)}
          </Form.Item>
          <Form.Item label="Provinsi:">
            {getFieldDecorator("provinsi", {rules: [{ required: true, message: "Masukkan Provinsi!" }],})(
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
            {getFieldDecorator("kabupaten", {rules: [{ required: true, message: "Masukkan Kabupaten!" }],})(
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
            {getFieldDecorator("kecamatan", {rules: [{ required: true, message: "Masukkan Kecamatan!" }],})(
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
            {getFieldDecorator("desa", {rules: [{ required: true, message: "Masukkan Desa!" }],})(
              <Select placeholder="Masukkan Desa" onChange={this.handleVillageChange}>
                {villages.map((village) => (
                  <Select.Option key={village.id} value={village.name}>
                    {village.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Alamat:">
              {getFieldDecorator("alamat", {
                  rules: [{ required: true, message: "Masukkan Alamat!" }],
              }
              )(<Input placeholder="Masukkan Alamat" />)}
          </Form.Item>
          <Form.Item label="Latitude:">
            {getFieldDecorator("latitude")(<Input placeholder="Latitude" disabled />)}
          </Form.Item>
          <Form.Item label="Longitude:">
            {getFieldDecorator("longitude")(<Input placeholder="Longitude" disabled />)}
          </Form.Item>
          <Form.Item label="Nama Peternak:">
            {getFieldDecorator("peternak_id", {
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
          <Form.Item label="ID Kandang:">
            {getFieldDecorator("kandang_id", {
              rules: [
                { required: true, message: "Silahkan isi id kandang" },
              ],
            })(
              <Select placeholder="Pilih ID Kandang">
                {kandangList.map((kandangId) => (
                  <Option key={kandangId} value={kandangId}>
                    {kandangId}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Spesies:">
            {getFieldDecorator("spesies", { initialValue: "Sapi Limosin" })(
              <Select style={{ width: 150 }}>
                <Select.Option value="Sapi Limosin">Sapi Limosin</Select.Option>
                <Select.Option value="Sapi Simental">
                  Sapi Simental
                </Select.Option>
                <Select.Option value="Sapi PO">Sapi PO</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Jenis Kelamin:">
            {getFieldDecorator("sex", { initialValue: "Betina" })(
              <Select style={{ width: 150 }}>
                <Select.Option value="Betina">Betina</Select.Option>
                <Select.Option value="Jantan">Jantan</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Umur:">
            {getFieldDecorator(
              "umur",
              {rules: [
                { required: true, message: "Silahkan isi umur hewan" },
              ],}
            )(<Input placeholder="Masukkan umur" />)}
          </Form.Item>
          <Form.Item label="Identifikasi Hewan:">
            {getFieldDecorator("identifikasiHewan", { rules: [
                { required: true, message: "Silahkan isi Identifikasi Hewan" },
              ],
            })(<Input placeholder="Masukkan identifikasi hewan" />)}
          </Form.Item>
          <Form.Item label="Petugas Pendaftar:">
            {getFieldDecorator("petugas_id", {
              rules: [
                { required: true, message: "Silahkan isi petugas pendaftar" },
              ],
            })(
              <Select placeholder="Pilih Petugas Pendaftar">
                {petugasList.map((petugas) => (
                  <Option key={petugas.nikPetugas} value={petugas.nikPetugas}>
                    {petugas.namaPetugas}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Tanggal Terdaftar:">
            {getFieldDecorator(
              "tanggalTerdaftar",
              {rules: [
                { required: true, message: "Silahkan isi tanggal" },
              ],}
            )(<Input type="date" placeholder="Masukkan Tanggal Terdaftar" />)}
          </Form.Item>
          <Form.Item label="Foto Hewan" name="file">
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

export default Form.create({ name: "AddHewanForm" })(AddHewanForm);
