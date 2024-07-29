import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { getPetugas } from "@/api/petugas"; // Import the API function to fetch petugas data
import { getPeternaks } from "@/api/peternak"; 
import { getHewans } from "../../../api/hewan";

const { Option } = Select;

class AddKelahiranForm extends Component {
 
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
        title="Tambah Kelahiran"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
          <Form.Item label="ID Kejadian:">
            {getFieldDecorator(
              "idKejadian",
              {}
            )(<Input placeholder="Masukkan ID kejadian" />)}
          </Form.Item>
          <Form.Item label="Tanggal Laporan:">
            {getFieldDecorator(
              "tanggalLaporan",
              {}
            )(<Input type="date" placeholder="Masukkan tanggal laporan" />)}
          </Form.Item>
          <Form.Item label="Tanggal Lahir:">
            {getFieldDecorator(
              "tanggalLahir",
              {}
            )(<Input type="date" placeholder="Masukkan tanggal lahir" />)}
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
          <Form.Item label="Eartag Induk:">
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
          <Form.Item label="ID Pejantan Straw:">
            {getFieldDecorator(
              "idPejantanStraw",
              {}
            )(<Input placeholder="Masukkan ID" />)}
          </Form.Item>
          <Form.Item label="ID Batch Straw:">
            {getFieldDecorator(
              "idBatchStraw",
              {}
            )(<Input placeholder="Masukkan ID" />)}
          </Form.Item>
          <Form.Item label="Produsen Straw:">
            {getFieldDecorator(
              "produsenStraw",
              {}
            )(<Input placeholder="Masukkan produsen" />)}
          </Form.Item>
          <Form.Item label="Spesies Pejantan:">
            {getFieldDecorator("spesiesPejantan", {
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
          <Form.Item label="Eartag Anak:">
            {getFieldDecorator(
              "eartagAnak",
              {}
            )(<Input placeholder="Masukkan Eartag" />)}
          </Form.Item>
          <Form.Item label="Jenis Kelamin Anak:">
            {getFieldDecorator("jenisKelaminAnak", {
              initialValue: "Betina",
            })(
              <Select style={{ width: 150 }}>
                <Select.Option value="Betina">Betina</Select.Option>
                <Select.Option value="Jantan">Jantan</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Spesies Anak:">
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
          <Form.Item label="Petugas Pelapor:">
            {getFieldDecorator("petugas_id", {
              rules: [
                { required: true, message: "Silahkan isi Inseminator" },
              ],
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
              {}
            )(<Input placeholder="Masukkan urutan " />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddKelahiranForm" })(AddKelahiranForm);
