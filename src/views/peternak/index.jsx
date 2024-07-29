import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getPeternaks,
  deletePeternak,
  editPeternak,
  addPeternak,
} from "@/api/peternak";
import { register } from "@/api/user";
import {getPetugas} from "@/api/petugas"
import TypingCard from "@/components/TypingCard";
import EditPeternakForm from "./forms/edit-peternak-form";
import AddPeternakForm from "./forms/add-peternak-form";
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { read, utils } from "xlsx";
import { reqUserInfo } from "../../api/user";
const { Column } = Table;


class Peternak extends Component {
  constructor(props) {
      super(props);
      this.state = {
      petugas: [],
      peternaks: [],
      editPeternakModalVisible: false,
      editPeternakModalLoading: false,
      currentRowData: {},
      addPeternakModalVisible: false,
      addPeternakModalLoading: false,
      importModalVisible: false,
      importedData: [], // Tambahkan data import
      searchKeyword: "",
      user: null,
    };
  }

  getPeternaks = async () => {
    const result = await getPeternaks();
    const { content, statusCode } = result.data;
  
    if (statusCode === 200) {
      const filteredPeternaks = content.filter((peternak) => {
        const { namaPeternak, nikPeternak, idPeternak, petugasPendaftar, lokasi } = peternak;
        const keyword = this.state.searchKeyword.toLowerCase();
        
        const isNamaPeternakValid = typeof namaPeternak === 'string';
        const isNikPeternakValid = typeof nikPeternak === 'string';
        const isIdPeternakValid = typeof idPeternak === 'string';
        const isPetugasPendaftarValid = typeof petugasPendaftar === 'string';
        const isLokasiValid = typeof lokasi === 'string';

        return (
          (isNamaPeternakValid && namaPeternak.toLowerCase().includes(keyword)) ||
          (isNikPeternakValid && nikPeternak.toLowerCase().includes(keyword)) ||
          (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
          (isPetugasPendaftarValid && petugasPendaftar.toLowerCase().includes(keyword)) ||
          (isLokasiValid && lokasi.toLowerCase().includes(keyword))
        );
      });
  
      this.setState({
        peternaks: filteredPeternaks,
      });
    }
  };

  getPetugas = async () => {
    const result = await getPetugas();
    const { content, statusCode } = result.data;
  
    if (statusCode === 200) {
      this.setState({
        petugas: content,
      });
    }
  };

  handleSearch = (keyword) => {
    this.setState({
      searchKeyword: keyword,
    }, () => {
      this.getPeternaks(); 
    });
  };

  handleEditPeternak = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editPeternakModalVisible: true,
    });
  };

  handleDeletePeternak = (row) => {
    const { idPeternak } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deletePeternak({ idPeternak }).then((res) => {
          message.success("Berhasil dihapus");
          this.getPeternaks();
        });
      },
    });
  };

  handleEditPeternakOk = (_) => {
    const { form } = this.editPeternakFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editPeternak(values, values.idPeternak)
        .then((response) => {
          form.resetFields();
          this.setState({
            editPeternakModalVisible: false,
            editPeternakModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getPeternaks();
        })
        .catch((e) => {
          message.success("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

  //Fungsi Import File Csv
  handleImportModalOpen = () => {
    this.setState({ importModalVisible: true });
  };
  
  handleImportModalClose = () => {
    this.setState({ importModalVisible: false });
  };

  handleFileImport = (file) => {
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });
  
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
  
      const importedData = jsonData.slice(1); // Exclude the first row (column titles)
  
      const columnTitles = jsonData[0]; // Assume the first row contains column titles
  
      // Get the file name from the imported file
      const fileName = file.name.toLowerCase();
  
      this.setState({
        importedData,
        columnTitles,
        fileName, // Set the fileName in the state
      });

      // Create column mapping
      const columnMapping = {};
      columnTitles.forEach((title, index) => {
        columnMapping[title] = index;
      });
      this.setState({ columnMapping });
    };
    reader.readAsArrayBuffer(file);
  };

  convertToJSDate(input) {
    let date;
    
    if (typeof input === 'number') {
      const utcDays = Math.floor(input - 25569);
      const utcValue = utcDays * 86400;
      const dateInfo = new Date(utcValue * 1000);
      date = new Date(dateInfo.getFullYear(), dateInfo.getMonth(), dateInfo.getDate()).toString();
    } else if (typeof input === 'string') {
      const [day, month, year] = input.split('/');
      date = new Date(`${year}-${month}-${day}`).toString();
    }
  
    return date;
  }

  saveImportedData = async (columnMapping) => {
    const { importedData, peternaks } = this.state;
    let errorCount = 0;
  
    try {
      for (const row of importedData) {
        const dataToSave = {
          
          idPeternak: row[columnMapping["NIK Pemilik Ternak**)"]],
          nikPeternak: row[columnMapping["No. Eartag***)"]],
          namaPeternak: row[columnMapping["Nama Pemilik Ternak**)"] || columnMapping["nama"] ],
          lokasi: row[columnMapping["Alamat Pemilik Ternak**)"] || columnMapping["lokasi"]],
          petugas_id: row[columnMapping["Petugas Pendaftar"] || columnMapping["NIK Petugas Pendataan*)"]],
          tanggalPendaftaran: row[columnMapping["Tanggal Pendataan"]] || this.convertToJSDate(row[columnMapping["Tanggal Pendaftaran"]]),
        };
        const existingPeternakIndex = peternaks.findIndex(p => p.idPeternak === dataToSave.idPeternak);
        try {
          if (existingPeternakIndex > -1) {
            // Update existing data
            await editPeternak(dataToSave, dataToSave.idPeternak);
            this.setState((prevState) => {
              const updatedPeternak = [...prevState.peternaks];
              updatedPeternak[existingPeternakIndex] = dataToSave;
              return { peternaks: updatedPeternak };
            });
          } else {
            // Add new data
            await addPeternak(dataToSave);
            this.setState((prevState) => ({
              peternaks: [...prevState.peternaks, dataToSave],
            }));
          }
        } catch (error) {
          errorCount++;
          console.error("Gagal menyimpan data:", error);
        }
      }
  
      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
      } else {
        message.error(`${errorCount} data gagal disimpan, harap coba lagi!`);
      }
  
    } catch (error) {
      console.error("Gagal memproses data:", error);
    } finally {
      this.setState({
        importedData: [],
        columnTitles: [],
        columnMapping: {},
      });
    }
  };
  

  handleCancel = (_) => {
    this.setState({
      editPeternakModalVisible: false,
      addPeternakModalVisible: false,
    });
  };

  handleAddPeternak = (row) => {
    this.setState({
      addPeternakModalVisible: true,
    });
  };

  handleAddPeternakOk = (_) => {
    const { form } = this.addPeternakFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addPeternakModalLoading: true });
      const peternakData = {
        idPeternak: values.idPeternak,
        namaPeternak: values.namaPeternak,
        nikPeternak: values.nikPeternak,
        provinsi: values.provinsi,
        kabupaten: values.kabupaten,
        kecamatan: values.kecamatan,
        desa: values.desa,
        lokasi: values.lokasi,
        petugas_id: values.petugas_id,
        tanggalPendaftaran: values.tanggalPendaftaran,
      };
  
      const userData = {
        name: values.namaPeternak,
        username: values.nikPeternak,
        email:values.namaPeternak+"@gmail.com",
        password: values.nikPeternak,
        roles: "3",
      };
      addPeternak(peternakData)
      register(userData)
        .then((response) => {
          form.resetFields();
          this.setState({
            addPeternakModalVisible: false,
            addPeternakModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getPeternaks();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, harap coba lagi!");
        });
    });
  };

  componentDidMount() {
    this.getPeternaks();
    this.getPetugas();

    reqUserInfo()
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }

  //Fungsi Upload data dan save ke database
  handleUpload = () => {
    const { importedData, columnMapping } = this.state;
  
    if (importedData.length === 0) {
      message.error("No data to import.");
      return;
    }
  
    this.setState({ uploading: true });
  
    this.saveImportedData(columnMapping)
      .then(() => {
        this.setState({
          uploading: false,
          importModalVisible: false,
        });
      })
      .catch((error) => {
        console.error("Gagal mengunggah data:", error);
        this.setState({ uploading: false });
        message.error("Gagal mengunggah data, harap coba lagi.");
      });
  };
  
  //Fungsi Export dari database ke file csv
  handleExportData = () => {
    const { peternaks } = this.state;
    const csvContent = this.convertToCSV(peternaks);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = [
      "ID Peternak",
      "Nama Peternak",
      "NIK Peternak",
      "Lokasi",
      "Petugas Pendafatar",
      "Tanggal Pendafaran",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.idPeternak,
        item.namaPeternak,
        item.nikPeternak,
        item.lokasi,
        item.petugas ? item.petugas.namaPetugas : "",
        moment(item.tanggalPendaftaran).format("DD/MM/YYYY"),
      ];
      console.log(row);
      rows.push(row);
    });

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach((rowArray) => {
      const row = rowArray.join(";");
      csvContent += row + "\r\n";
    });

    return csvContent;
  };

  downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Peternak.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };
  
  render() {
    const { peternaks, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      {title:"NIK Peternak", dataIndex:"idPeternak", key:"idPeternak"},
      {title:"ID Peternak", dataIndex:"nikPeternak", key:"nikPeternak"},
      {title:"Nama Peternak", dataIndex:"namaPeternak", key:"namaPeternak"},
      {title:"Lokasi", dataIndex:"lokasi", key:"lokasi"},
      {title:"Petugas Pendaftar", dataIndex:"petugas.namaPetugas", key:"namaPetugas"},
      {title:"Tanggal Pendaftaran", dataIndex:"tanggalPendaftaran", key:"tanggalPendaftaran"},
    ];
    console.log(peternaks);
    const renderTable = () => {
      if (user &&  user.role === 'ROLE_PETERNAK') {
        return <Table dataSource={peternaks} bordered columns={columns} />;
      } else if (user && user.role === 'ROLE_ADMINISTRATOR' || 'ROLE_PETUGAS') {
        return <Table dataSource={peternaks} bordered columns={(columns && renderColumns())}/>
      }
      else {
        return null;
      }
    };
  
    const renderButtons = () => {
      if (user && (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')) {
        return (
          <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button type="primary" onClick={this.handleAddPeternak}>
                Tambah Peternak
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button icon={<UploadOutlined />} onClick={this.handleImportModalOpen}>
                Import File
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button icon={<UploadOutlined />} onClick={this.handleExportData}>
                Export File
              </Button>
            </Col>
          </Row>
        );
      } else {
        return null;
      }
    };
  
    const renderColumns = () => {
      if (user && user.role === 'ROLE_ADMINISTRATOR' || 'ROLE_PETUGAS') {
        columns.push({
          title: "Operasi",
          key: "action",
          width: 120,
          align: "center",
          render: (text, row) => (
            <span>
              <Button
                type="primary"
                shape="circle"
                icon="edit"
                title="Edit"
                onClick={() => this.handleEditPeternak(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                title="Delete"
                onClick={() => this.handleDeletePeternak(row)}
              />
            </span>
          ),
        });
      }
      return columns;
    };
  
    const title = (
      <Row gutter={[16, 16]} justify="start">
        {renderButtons()}
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Input
            placeholder="Cari data"
            value={searchKeyword}
            onChange={(e) => this.handleSearch(e.target.value)}
            style={{ width: 235, marginRight: 10 }}
          />
        </Col>
      </Row>
    );
  
    const { role } = user ? user.role : '';
    console.log("peran pengguna:",role);
    const cardContent = `Di sini, Anda dapat mengelola daftar peternak di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Peternak" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
        </Card>
        <EditPeternakForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editPeternakFormRef = formRef)
          }
          visible={this.state.editPeternakModalVisible}
          confirmLoading={this.state.editPeternakModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditPeternakOk}
        />
        <AddPeternakForm
          wrappedComponentRef={(formRef) =>
            (this.addPeternakFormRef = formRef)
          }
          visible={this.state.addPeternakModalVisible}
          confirmLoading={this.state.addPeternakModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddPeternakOk}
        />
        <Modal
          title="Import File"
          visible={importModalVisible}
          onCancel={this.handleImportModalClose}
          footer={[
            <Button key="cancel" onClick={this.handleImportModalClose}>
              Cancel
            </Button>,
            <Button
              key="upload"
              type="primary"
              loading={this.state.uploading}
              onClick={this.handleUpload}
            >
              Upload
            </Button>,
          ]}
        >
          <Upload beforeUpload={this.handleFileImport}>
            <Button icon={<UploadOutlined />}>Pilih File</Button>
          </Upload>
        </Modal>
      </div>
    );
  }
}

export default Peternak;
