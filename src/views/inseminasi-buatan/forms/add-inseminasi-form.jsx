import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { getPetugas } from "@/api/petugas"; // Import the API function to fetch petugas data
import { getPeternaks } from "@/api/peternak"; 
import { getHewans } from "../../../api/hewan";
const { Option } = Select;

class AddInseminasiBuatanForm extends Component {

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
    const { petugasList, peternakList, hewanList   } = this.state;
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
        title="Tambah Data Inseminasi Buatan"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
          <Form.Item label="ID Inseminasi:">
            {getFieldDecorator("idInseminasi", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi id inseminasi buatan",
                },
              ],
            })(<Input placeholder="Masukkan ID Inseminasi" />)}
          </Form.Item>
          <Form.Item label="Inseminator:">
            {getFieldDecorator("petugas_id", {
              rules: [
                { required: true, message: "Silahkan isi Inseminator" },
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
          <Form.Item label="Produsen:">
            {getFieldDecorator("produsen", { initialValue: "BBIB Singosari" })(
              <Select style={{ width: 150 }}>
                <Select.Option value="BBIB Singosari">
                  BBIB Singosari
                </Select.Option>
                <Select.Option value="BIB Lembang">BIB Lembang</Select.Option>
              </Select>
            )}
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
          <Form.Item label="IB:">
            {getFieldDecorator("ib", {
              initialValue: "1",
            })(
              <Select style={{ width: 150 }}>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">
                 2
                </Select.Option>
                <Select.Option value="3">3</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="ID Pejantan:">
            {getFieldDecorator("idPejantan", {
              rules: [{ required: true, message: "Silahkan isi id pejantan" }],
            })(<Input placeholder="Masukkan ID Pejantan" />)}
          </Form.Item>
          <Form.Item label="Bangsa Pejantan:">
            {getFieldDecorator("bangsaPejantan", {
              initialValue: "Sapi Limosin",
            })(
              <Select style={{ width: 150 }}>
                <Select.Option value="Sapi Limosin">Sapi Limosin</Select.Option>
                <Select.Option value="Sapi Simental">
                  Sapi Simental
                </Select.Option>
                <Select.Option value="Sapi FH">Sapi FH</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="ID Pembuatan:">
            {getFieldDecorator("idPembuatan", {
              rules: [{ required: true, message: "Silahkan isi id pembuatan" }],
            })(<Input placeholder="Masukkan ID Pembuatan" />)}
          </Form.Item>
          <Form.Item label="Tanggal IB:">
            {getFieldDecorator("tanggalIB", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi tanggal inseminasi buatan",
                },
              ],
            })(<Input type="date" placeholder="Masukkan Tanggal IB" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddInseminasiBuatanForm" })(
  AddInseminasiBuatanForm
);
