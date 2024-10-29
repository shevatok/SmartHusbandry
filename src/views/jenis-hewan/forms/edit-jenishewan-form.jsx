/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak";
import { getKandang } from "@/api/kandang";


const { Option } = Select;
class EditJenisHewanForm extends Component {
  state = {
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
    kandangList: [],
    petugasList: [],
    peternakList: [],
  };

  fetchPetugasList = async () => {
    try {
      const result = await getPetugas(); // Fetch petugas data from the server
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        // Extract petugas names and nikPetugas
        const petugasList = content.map((petugas) => ({
          nikPetugas: petugas.nikPetugas,
          namaPetugas: petugas.namaPetugas,
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
          namaPeternak: peternak.namaPeternak,
        }));
        this.setState({ peternakList });
      }
    } catch (error) {
      // Handle error if any
      console.error("Error fetching peternak data: ", error);
    }
  };

  componentDidMount() {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((provinces) => this.setState({ provinces }));
    this.fetchPetugasList();
    this.fetchPeternakList();
    this.fetchKandangList();
  }

  handleProvinceChange = (value) => {
    const selectedProvince = this.state.provinces.find(
      (province) => province.name === value
    );

    if (selectedProvince) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`
      )
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
    const selectedRegency = this.state.regencies.find(
      (regency) => regency.name === value
    );

    if (selectedRegency) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`
      )
        .then((response) => response.json())
        .then((districts) => this.setState({ districts }));
    }

    this.props.form.setFieldsValue({
      kecamatan: undefined,
      desa: undefined,
    });
  };

  handleDistrictChange = (value) => {
    const selectedDistrict = this.state.districts.find(
      (district) => district.name === value
    );

    if (selectedDistrict) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict.id}.json`
      )
        .then((response) => response.json())
        .then((villages) => this.setState({ villages }));
    }

    this.props.form.setFieldsValue({
      desa: undefined,
    });
  };

  handleVillageChange = async (value) => {
    const { provinces, regencies, districts, villages } = this.state;
    const selectedProvince = provinces.find(
      (province) => province.name === this.props.form.getFieldValue("provinsi")
    );
    const selectedRegency = regencies.find(
      (regency) => regency.name === this.props.form.getFieldValue("kabupaten")
    );
    const selectedDistrict = districts.find(
      (district) => district.name === this.props.form.getFieldValue("kecamatan")
    );
    const selectedVillage = villages.find((village) => village.name === value);

    if (
      selectedProvince &&
      selectedRegency &&
      selectedDistrict &&
      selectedVillage
    ) {
      const mergedLocation = `${selectedVillage.name}, ${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`;
      this.setState({ mergedLocation });
      this.props.form.setFieldsValue({
        alamat: mergedLocation,
      });
    }

    const alamat = this.props.form.getFieldValue("alamat");
    const prov = selectedProvince ? selectedProvince.name : "";
    const kec = selectedDistrict ? selectedDistrict.name : "";
    const desa = selectedVillage ? selectedVillage.name : "";

    console.log(alamat);

    console.log(prov);

    console.log(desa);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          `${kec}, ${desa}`
        )}&format=json`
      );
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
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } =
      this.props;

    const { getFieldDecorator } = form;
    const {
      kodeEartagNasional,
      alamat,
      peternak,
      kandang,
      JenisHewan,
      spesies,
      sex,
      jumlah,
    } = currentRowData;
    const { provinces, regencies, districts, villages } = this.state;
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

    const { peternakList, kandangList } = this.state;

    return (
      <Modal
        title="Edit Hewan"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID:">
            {getFieldDecorator("kodeEartagNasional", {
              initialValue: kodeEartagNasional,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Provinsi:">
            {getFieldDecorator("provinsi", {
              rules: [{ required: true, message: "Masukkan Provinsi!" }],
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
            {getFieldDecorator("kabupaten", {
              rules: [{ required: true, message: "Masukkan Kabupaten!" }],
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
            {getFieldDecorator("kecamatan", {
              rules: [{ required: true, message: "Masukkan Kecamatan!" }],
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
            {getFieldDecorator("desa", {
              rules: [{ required: true, message: "Masukkan Desa!" }],
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
            {getFieldDecorator("alamat", {
              initialValue: alamat,
              rules: [{ required: true, message: "Masukkan Alamat!" }],
            })(<Input placeholder="Masukkan Alamat" />)}
          </Form.Item>
          <Form.Item label="Latitude:">
            {getFieldDecorator("latitude")(
              <Input placeholder="Latitude" disabled />
            )}
          </Form.Item>
          <Form.Item label="Longitude:">
            {getFieldDecorator("longitude")(
              <Input placeholder="Longitude" disabled />
            )}
          </Form.Item>
          <Form.Item label="Nama Peternak:">
            {getFieldDecorator("peternak_id", {
              initialValue: peternak ? peternak.namaPeternak : undefined,
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
              initialValue: kandang ? kandang.idKandang : undefined,
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
          <Form.Item label="Jenis Hewan:">
            {getFieldDecorator("Jenis Hewan", { initialValue: JenisHewan })(
              <Select style={{ width: 150 }}>
                <Select.Option value="Sapi">Sapi </Select.Option>
                <Select.Option value="Kambing">Kambing</Select.Option>
                <Select.Option value="Domba">Domba</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Spesies:">
            {getFieldDecorator("spesies", { initialValue: spesies })(
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
            {getFieldDecorator("sex", { initialValue: sex })(
              <Select style={{ width: 150 }}>
                <Select.Option value="Betina">Betina</Select.Option>
                <Select.Option value="Jantan">Jantan</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Jumlah:">
            {getFieldDecorator("jumlah", { initialValue: jumlah })(
              <Input placeholder="Masukkan Jumlah" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditJenisHewanForm" })(EditJenisHewanForm);
