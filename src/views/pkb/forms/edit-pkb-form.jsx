import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak"; 
import { getHewans } from "../../../api/hewan";

const { Option } = Select;

class EditPKBForm extends Component {

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
    const { petugasList, peternakList, hewanList } = this.state;
    const {
      idKejadian,
      tanggalPkb,
      peternak,
      hewan,
      spesies,
      umurKebuntingan,
      petugas,
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
        title="Edit PKB"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={820}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Kejadian:">
            {getFieldDecorator("idKejadian", { initialValue: idKejadian })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item label="Tanggal PKB:">
            {getFieldDecorator("tanggalPkb", { initialValue: tanggalPkb })(
              <Input type="date" placeholder="Masukkan tanggal" />
            )}
          </Form.Item>
          <Form.Item label="Nama Peternak:">
            {getFieldDecorator("peternak_id", {
              initialValue:peternak?peternak.namaPeternak:undefined
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
              initialValue:hewan?hewan.kodeEartagNasional:undefined
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
          <Form.Item label="Umur Kebuntingan Saat PKB:">
            {getFieldDecorator("umurKebuntingan", {
              initialValue: umurKebuntingan,
            })(<Input placeholder="Masukkan Umur" />)}
          </Form.Item>
          <Form.Item label="Pemeriksa Kebuntingan:">
            {getFieldDecorator("petugas_id", {
              initialValue: petugas? petugas.namaPetugas : undefined,
            })(<Select>
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

export default Form.create({ name: "EditUserForm" })(EditPKBForm);
