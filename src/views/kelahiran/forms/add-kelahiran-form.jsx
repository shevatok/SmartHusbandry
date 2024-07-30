import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { getPetugas } from "@/api/petugas"; // Import the API function to fetch petugas data
import { getPeternaks } from "@/api/peternak"; 
import { getHewans } from "@/api/hewan";
import {getInseminasis} from "@/api/inseminasi";
import {getKandang} from "@/api/kandang";

const { Option } = Select;

class AddKelahiranForm extends Component {
 
  state = {
    hewanList: [],
    petugasList: [],
    peternakList: [],
    inseminasiList: [],
    kandangList: []
  };

  componentDidMount() {
    this.fetchPetugasList();
    this.fetchPeternakList();
    this.fetchHewanList();
    this.fetchKandangList();
    this.fetchInseminasiList();
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

  fetchKandangList = async () => {
    try {
      const result = await getKandang(); 
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const kandangList = content.map((kandang) => ({
          idKandang: kandang.idKandang
        }));
        this.setState({ kandangList });
      }
    } catch (error) {
      // Handle error if any
      console.error("Error fetching kandang data: ", error);
    }
  };

  fetchInseminasiList = async () => {
    try {
      const result = await getInseminasis(); // Fetch peternak data from the server
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const inseminasiList = content.map((inseminasi) => ({
          idInseminasi: inseminasi.idInseminasi,
        }));
        this.setState({ inseminasiList });
      }
    } catch (error) {
      
    }
  }


  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const { petugasList, peternakList, hewanList, kandangList, inseminasiList   } = this.state;
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
          <Form.Item label="ID Inseminasi:">
            {getFieldDecorator("inseminasi_id", {
              rules: [
                { required: true, message: "Silahkan isi inseminasi" },
              ],
            })(
              <Select placeholder="Pilih Inseminasi">
                {inseminasiList.map((inseminasi) => (
                  <Option key={inseminasi.idInseminasi} value={inseminasi.idInseminasi}>
                    {inseminasi.idInseminasi}
                  </Option>
                ))}
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
          <Form.Item label="Kandang Anak:">
            {getFieldDecorator("kandang_id", {
              rules: [
                { required: true, message: "Silahkan isi ID Kandang" },
              ],
            })(
              <Select placeholder="Pilih ID Hewan">
                {kandangList.map((kandang) => (
                  <Option key={kandang.idKandang} value={kandang.idKandang}>
                    {kandang.idKandang}
                  </Option>
                ))}
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
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddKelahiranForm" })(AddKelahiranForm);
