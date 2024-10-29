import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { getPetugas } from "@/api/petugas"; // Import the API function to fetch petugas data

const { Option } = Select;

class EditPeternakForm extends Component {
  state = {
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
    petugasList: [], // To store the list of petugas names
    selectedProvince: undefined,
    selectedRegency: undefined,
    selectedDistrict: undefined,
    selectedVillage: undefined,
  };

  componentDidMount() {
    this.fetchProvinces();
    this.fetchPetugasList();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentRowData } = this.props;
    if (
      prevProps.currentRowData.lokasi !== currentRowData.lokasi &&
      currentRowData.lokasi
    ) {
      this.initializeForm();
    }
  }

  fetchProvinces = () => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((provinces) => {
        this.setState({ provinces }, () => {
          this.initializeForm();
        });
      });
  };

  initializeForm = () => {
    const { currentRowData } = this.props;
    const { lokasi } = currentRowData;

    if (lokasi) {
      const [village, district, regency, province] = lokasi
        .split(", ")
        .map((item) => item.trim());

      this.setState(
        {
          selectedProvince: province,
          selectedRegency: regency,
          selectedDistrict: district,
          selectedVillage: village,
        },
        () => {
          this.loadRegencies(province);
        }
      );
    }
  };

  loadRegencies = (province) => {
    const selectedProvinceData = this.state.provinces.find(
      (prov) => prov.name === province
    );
    if (selectedProvinceData) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceData.id}.json`
      )
        .then((response) => response.json())
        .then((regencies) =>
          this.setState({ regencies }, () => {
            this.loadDistricts(this.state.selectedRegency);
          })
        );
    }
  };

  loadDistricts = (regency) => {
    const selectedRegencyData = this.state.regencies.find(
      (reg) => reg.name === regency
    );
    if (selectedRegencyData) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegencyData.id}.json`
      )
        .then((response) => response.json())
        .then((districts) =>
          this.setState({ districts }, () => {
            this.loadVillages(this.state.selectedDistrict);
          })
        );
    }
  };

  loadVillages = (district) => {
    const selectedDistrictData = this.state.districts.find(
      (dist) => dist.name === district
    );
    if (selectedDistrictData) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrictData.id}.json`
      )
        .then((response) => response.json())
        .then((villages) => this.setState({ villages }));
    }
  };

  handleProvinceChange = (value) => {
    const selectedProvince = this.state.provinces.find(
      (province) => province.name === value
    );

    if (selectedProvince) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`
      )
        .then((response) => response.json())
        .then((regencies) =>
          this.setState({ regencies, districts: [], villages: [] })
        );
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
        .then((districts) => this.setState({ districts, villages: [] }));
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

  handleVillageChange = (value) => {
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
        lokasi: mergedLocation,
      });
    }
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

  render() {
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } =
      this.props;
    const {
      provinces,
      regencies,
      districts,
      villages,
      selectedProvince,
      selectedRegency,
      selectedDistrict,
      selectedVillage,
    } = this.state;
    const { getFieldDecorator } = form;
    const {
      idPeternak,
      namaPeternak,
      nikPeternak,
      lokasi,
      petugas,
      tanggalPendaftaran,
    } = currentRowData;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { petugasList } = this.state;

    return (
      <Modal
        title="Edit Peternak"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Peternak:">
            {getFieldDecorator("idPeternak", {
              initialValue: idPeternak,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Nama Peternak:">
            {getFieldDecorator("namaPeternak", {
              initialValue: namaPeternak,
            })(<Input placeholder="Masukkan Nama Peternak" />)}
          </Form.Item>
          <Form.Item label="NIK Peternak:">
            {getFieldDecorator("nikPeternak", {
              initialValue: nikPeternak,
            })(<Input placeholder="Masukkan NIK Peternak" />)}
          </Form.Item>
          <Form.Item label="Provinsi:">
            {getFieldDecorator("provinsi", {
              initialValue: selectedProvince,
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
              initialValue: selectedRegency,
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
              initialValue: selectedDistrict,
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
              initialValue: selectedVillage,
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
          <Form.Item label="Lokasi:">
            {getFieldDecorator("lokasi", {
              initialValue: lokasi,
            })(<Input placeholder="Masukkan Lokasi" />)}
          </Form.Item>
          <Form.Item label="Petugas Pendaftar:">
            {getFieldDecorator("petugas_id", {
              initialValue: petugas ? petugas.namaPetugas : undefined,
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
          <Form.Item label="Tanggal Pendaftaran:">
            {getFieldDecorator("tanggalPendaftaran", {
              initialValue: tanggalPendaftaran,
            })(
              <Input type="date" placeholder="Masukkan Tanggal Pendaftaran" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditPeternakForm" })(EditPeternakForm);
