import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { getPetugas } from "@/api/petugas"; 
import { getPeternaks } from "@/api/peternak"; 
import { getHewans } from "../../../api/hewan";

const { Option } = Select;

class AddVaksinForm extends Component {

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
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const { petugasList, peternakList, hewanList} = this.state;
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
    return (
      <Modal
        title="Tambah Data Vaksin Buatan"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
          <Form.Item label="ID Vaksin:">
            {getFieldDecorator("idVaksin", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi id vaksin buatan",
                },
              ],
            })(<Input placeholder="Masukkan ID Vaksin" />)}
          </Form.Item>
          <Form.Item label="Nama Vaksin:">
            {getFieldDecorator("namaVaksin", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi id vaksin buatan",
                },
              ],
            })(<Input placeholder="Masukkan ID Vaksin" />)}
          </Form.Item>
          <Form.Item label="Jenis Vaksin:">
            {getFieldDecorator("jenisVaksin", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi id vaksin buatan",
                },
              ],
            })(<Input placeholder="Masukkan ID Vaksin" />)}
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
          <Form.Item label="Eartag Hewan:">
            {getFieldDecorator("hewan_id", {
              rules: [
                { required: true, message: "Silahkan isi Eartag Hewan" },
              ],
            })(
              <Select placeholder="Pilih Eartag">
                {hewanList.map((eartag) => (
                  <Option key={eartag} value={eartag}>
                    {eartag}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Inseminator:">
            {getFieldDecorator("petugas_id", {
              rules: [
                { required: true, message: "Silahkan isi petugas pendaftar" },
              ],
            })(
              <Select placeholder="Pilih Inseminator">
                {petugasList.map((petugas) => (
                  <Option key={petugas.nikPetugas} value={petugas.nikPetugas}>
                    {petugas.namaPetugas}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Tanggal Vaksin:">
            {getFieldDecorator("tglVaksin", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi tanggal vaksin buatan",
                },
              ],
            })(<Input type="date" placeholder="Masukkan Tanggal IB" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddVaksinForm" })(
  AddVaksinForm
);
