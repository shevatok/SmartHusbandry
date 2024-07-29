import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { getPetugas } from "@/api/petugas"; // Import the API function to fetch petugas data
import { getPeternaks } from "@/api/peternak";
import { getHewans } from "../../../api/hewan"; 

const { Option } = Select;

class EditKelahiranForm extends Component {
  state = {
    hewanList: [],
    petugasList: [],
    peternakList: [],
  };

  componentDidMount() {
    this.fetchPetugasList();
    this.fetchPeternakList();
    this.fetchHewanList();
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

  fetchHewanList = async () => {
    try {
      const result = await getHewans();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({
          hewanList: content.map((hewan) => hewan.kodeEartagNasional), 
        });
      }
    } catch (error) {
      // Handle error if any
      console.error("Error fetching hewan data: ", error);
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
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } =
      this.props;
    const { getFieldDecorator } = form;
    const { petugasList, peternakList, hewanList   } = this.state;
    const {
      idKejadian,
      tanggalLaporan,
      tanggalLahir,
      peternak,
      hewan,
      idPejantanStraw,
      idBatchStraw,
      produsenStraw,
      spesiesPejantan,
      eartagAnak,
      jenisKelaminAnak,
      spesies,
      petugas,
      urutanIb,
    } = currentRowData;
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
        title="Edit Kelahiran"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Kejadian:">
            {getFieldDecorator("idKejadian", {
              initialValue: idKejadian,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Tanggal Laporan:">
            {getFieldDecorator(
              "tanggalLaporan",
              {initialValue: tanggalLaporan}
            )(<Input type="date" placeholder="Masukkan tanggal laporan" />)}
          </Form.Item>
          <Form.Item label="Tanggal Lahir:">
            {getFieldDecorator(
              "tanggalLahir",
              {initialValue: tanggalLahir}
            )(<Input type="date" placeholder="Masukkan tanggal lahir" />)}
          </Form.Item>
          <Form.Item label="Nama Peternak:">
            {getFieldDecorator("peternak_id", {
              initialValue: peternak?peternak.namaPeternak:undefined
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
          <Form.Item label="Eartag Induk:">
            {getFieldDecorator("hewan_id", {
              initialValue: hewan?hewan.kodeEartagNasional:undefined
            })(
              <Select placeholder="Pilih ID Hewan">
                {hewanList.map((eartag) => (
                  <Option key={eartag} value={eartag}>
                    {eartag}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="ID Pejantan Straw:">
            {getFieldDecorator(
              "idPejantanStraw",
              {initialValue: idPejantanStraw}
            )(<Input placeholder="Masukkan ID" />)}
          </Form.Item>
          <Form.Item label="ID Batch Straw:">
            {getFieldDecorator(
              "idBatchStraw",
              {initialValue: idBatchStraw}
            )(<Input placeholder="Masukkan ID" />)}
          </Form.Item>
          <Form.Item label="Produsen Straw:">
            {getFieldDecorator(
              "produsenStraw",
              {initialValue: produsenStraw}
            )(<Input placeholder="Masukkan produsen" />)}
          </Form.Item>
          <Form.Item label="Spesies Pejantan:">
            {getFieldDecorator("spesiesPejantan", {
              initialValue: spesiesPejantan,
            })(
              <Select style={{ width: 150 }}>
                <Select.Option value="Sapi Limosin">Sapi Limosin</Select.Option>
                <Select.Option value="Sapi Simental">
                  Sapi Simental
                </Select.Option>
                <Select.Option value="Sapi FH">Sapi FH</Select.Option>
                <Select.Option value="Sapi PO">Sapi PO</Select.Option>
                <Select.Option value="Sapi Brangus">Sapi Brangus</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Eartag Anak:">
            {getFieldDecorator(
              "eartagAnak",
              {initialValue: eartagAnak}
            )(<Input placeholder="Masukkan Eartag" />)}
          </Form.Item>
          <Form.Item label="Jenis Kelamin Anak:">
            {getFieldDecorator("jenisKelaminAnak", {
              initialValue: jenisKelaminAnak
            })(
              <Select style={{ width: 150 }}>
                <Select.Option value="Betina">Betina</Select.Option>
                <Select.Option value="Jantan">Jantan</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Spesies:">
            {getFieldDecorator("spesies", {
              initialValue: spesies,
            })(
              <Select style={{ width: 150 }}>
                <Select.Option value="Sapi Limosin">Sapi Limosin</Select.Option>
                <Select.Option value="Sapi Simental">
                  Sapi Simental
                </Select.Option>
                <Select.Option value="Sapi FH">Sapi FH</Select.Option>
                <Select.Option value="Sapi PO">Sapi PO</Select.Option>
                <Select.Option value="Sapi Brangus">Sapi Brangus</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Petugas Pelapor:">
            {getFieldDecorator("petugas_id", {
              initialValue: petugas?petugas.namaPetugas:undefined
            })(
              <Select placeholder="Pilih Petugas">
                {petugasList.map((petugas) => (
                  <Option key={petugas.nikPetugas} value={petugas.nikPetugas}>
                    {petugas.namaPetugas}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Urutan IB:">
            {getFieldDecorator(
              "urutanIb",
              {initialValue: urutanIb}
            )(<Input placeholder="Masukkan urutan " />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditKelahiranForm" })(EditKelahiranForm);
