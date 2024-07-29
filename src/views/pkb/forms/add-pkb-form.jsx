import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak"; 
import { getHewans } from "../../../api/hewan";

const { Option } = Select;

class AddPKBForm extends Component {

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

  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const { petugasList, peternakList, hewanList} = this.state;
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
        title="Tambah PKB"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={820}
      >
        <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
          <Form.Item label="ID Kejadian:">
            {getFieldDecorator(
              "idKejadian",
              {}
            )(<Input placeholder="Masukkan ID kejadian" />)}
          </Form.Item>
          <Form.Item label="Tanggal PKB:">
            {getFieldDecorator(
              "tanggalPkb",
              {}
            )(<Input type="date" placeholder="Masukkan tanggal" />)}
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
          <Form.Item label="ID Hewan:">
            {getFieldDecorator("hewan_id", {
              rules: [
                { required: true, message: "Silahkan isi ID Hewan" },
              ],
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
          <Form.Item label="Spesies:">
            {getFieldDecorator("spesies", {
              initialValue: "Sapi Limosin",
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
          <Form.Item label="Umur Kebuntingan Saat PKB:">
            {getFieldDecorator(
              "umurKebuntingan",
              {}
            )(<Input placeholder="Masukkan Umur" />)}
          </Form.Item>
          <Form.Item label="Pemeriksa Kebuntingan:">
            {getFieldDecorator(
              "petugas_id",
              {}
            )(<Select placeholder="Pilih Petugas">
            {petugasList.map((petugas) => (
                  <Option key={petugas.nikPetugas} value={petugas.nikPetugas}>
                    {petugas.namaPetugas}
                  </Option>
                ))}
          </Select>)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddPKBForm" })(AddPKBForm);
