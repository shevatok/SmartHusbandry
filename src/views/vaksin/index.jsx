import React, { Component } from "react";
import { Card, Button, Table, message, Row, Col, Divider, Modal, Upload, Input } from "antd";
import { getPeternaks } from "@/api/peternak";
import { getVaksins, getVaksinByPeternak, deleteVaksin, editVaksin, addVaksin } from "@/api/vaksin";
import {getPetugas} from "@/api/petugas";
import { UploadOutlined } from '@ant-design/icons';
import { read, utils } from "xlsx";
import moment from 'moment';
import AddVaksinForm from './forms/add-vaksin-form';
import EditVaksinForm from './forms/edit-vaksin-form';
import TypingCard from "@/components/TypingCard";
import { reqUserInfo } from "../../api/user";
import { status } from "nprogress";

const { Column } = Table
class Vaksin extends Component {
  state = {
    vaksins: [],
    peternaks: [],
    petugas: [],
    editVaksinModalVisible: false,
    editVaksinModalLoading: false,
    currentRowData: {},
    addVaksinModalVisible: false,
    addVaksinModalLoading: false,
    importModalVisible: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
    user: null,
  };

  getVaksins = async () => {
    const result = await getVaksins();

    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredVaksin = content.filter((vaksins) => {
        const { idVaksin, idPeternak,  namaPeternak, kodeEartagNasional,
        idPejantan, idPembuatan, bangsaPejantan, produsen, inseminator, lokasi } = vaksins;
        const keyword = this.state.searchKeyword.toLowerCase();
        
        const isIdVaksinValid = typeof idVaksin === 'string';
        const isIdPeternakValid = typeof idPeternak === 'string';
        const isNamaPeternakValid = typeof namaPeternak === 'string';
        const isKodeEartagNasionalValid = typeof kodeEartagNasional === 'string';
        const isIdPejantanValid = typeof idPejantan === 'string';
        const isIdPembuatanValid = typeof idPembuatan === 'string';
        const isBangsaPejantanValid = typeof bangsaPejantan === 'string';
        const isProdusenValid = typeof produsen === 'string';
        const isInseminatorValid = typeof inseminator === 'string';
        const isLokasiValid = typeof lokasi === 'string';

        return (
          (isIdVaksinValid && idVaksin.toLowerCase().includes(keyword)) ||
          (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
          (isNamaPeternakValid && namaPeternak.toLowerCase().includes(keyword)) ||
          (isKodeEartagNasionalValid && kodeEartagNasional.toLowerCase().includes(keyword)) ||
          (isIdPejantanValid && idPejantan.toLowerCase().includes(keyword)) ||
          (isIdPembuatanValid && idPembuatan.toLowerCase().includes(keyword)) ||
          (isBangsaPejantanValid && bangsaPejantan.toLowerCase().includes(keyword)) ||
          (isProdusenValid && produsen.toLowerCase().includes(keyword)) ||
          (isInseminatorValid && inseminator.toLowerCase().includes(keyword)) ||
          (isLokasiValid && lokasi.toLowerCase().includes(keyword)) 
        );
      });
  
      this.setState({
        vaksins: filteredVaksin,
      });
    }
  };

  getVaksinByPeternak = async (peternakID) => {
    try {
      const result = await getVaksinByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({ vaksins: content });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  handleSearch = (keyword) => {
    this.setState({
      searchKeyword: keyword,
    }, () => {
      this.getVaksins(); 
    });
  };

  getPeternaks = async () => {
    const result = await getPeternaks();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        peternaks: content,
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

  handleEditVaksin = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editVaksinModalVisible: true,
    });
  };

  handleEditVaksinOk = (_) => {
    const { form } = this.editVaksinFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editVaksinModalLoading: true });
      editVaksin(values, values.idVaksin)
        .then((response) => {
          form.resetFields();
          this.setState({
            editVaksinModalVisible: false,
            editVaksinModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getVaksins();
        })
        .catch((e) => {
          message.success("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

  handleDeleteVaksin = (row) => {
    const { idVaksin } = row;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteVaksin({ idVaksin }).then((res) => {
          message.success("Berhasil dihapus");
          this.getVaksins();
        });
      },
    });
  };

  handleCancel = (_) => {
    this.setState({
      editVaksinModalVisible: false,
      addVaksinModalVisible: false,
      importModalVisible: false,
    });
  };

  handleAddVaksin = (row) => {
    this.setState({
      addVaksinModalVisible: true,
    });
  };

  handleAddVaksinOk = (_) => {
    const { form } = this.addVaksinFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addVaksinModalLoading: true });
      addVaksin(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addVaksinModalVisible: false,
            addVaksinModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getVaksins();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, harap coba lagi!");
        });
    });
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

  saveImportedData = async (columnMapping) => {
    const { importedData, vaksins, petugas } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const petugasNama = row[columnMapping["Inseminator"]]?.toLowerCase();
        const petugasData = petugas.find(p => p.namaPetugas.toLowerCase() === petugasNama);
        const petugasId = petugasData ? petugasData.nikPetugas : null;
        console.log(`Mencocokkan nama petugas: ${petugasNama}, Ditemukan: ${petugasData ? 'Ya' : 'Tidak'}, petugasId: ${petugasId}`);
        const dataToSave = {
          idVaksin: row[columnMapping["Batch Vaksin**)"]],
          namaVaksin: row[columnMapping["Nama Vaksin**)"]],
          jenisVaksin: row[columnMapping["Jenis Vaksin**)"]],
          peternak_id: row[columnMapping["NIK Pemilik Ternak**)"]],
          hewan_id: row[columnMapping["No. Eartag***)"]],
          petugas_id: row[columnMapping["NIK Petugas Pendataan*)"]],
          tglVaksin: row[columnMapping["Tanggal Vaksin**)"]]
        };
        const existingVaksinIndex = vaksins.findIndex(p => p.idVaksin === dataToSave.idVaksin);
  
        try {
          if (existingVaksinIndex > -1) {
            // Update existing data
            await editVaksin(dataToSave, dataToSave.idVaksin);
            this.setState((prevState) => {
              const updatedVaksin = [...prevState.vaksins];
              updatedVaksin[existingVaksinIndex] = dataToSave;
              return { vaksins: updatedVaksin };
            });
          } else {
            // Add new data
            await addVaksin(dataToSave);
            this.setState((prevState) => ({
              vaksins: [...prevState.vaksins, dataToSave],
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
      

  handleExportData = () => {
    const { vaksins } = this.state;
    const csvContent = this.convertToCSV(vaksins);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = [
      "ID Vaksin",
      "Nama Vaksin",
      "Jenis Vaksin",
      "Lokasi",
      "Nama Peternak",
      "NIK Peternak",
      "Eartag Hewan",
      "Inseminator",
      "Tanggal Vaksin"
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.idVaksin,
        item.namaVaksin,
        item.jenisVaksin,
        item.peternak.lokasi,
        item.peternak.namaPeternak,
        item.peternak.idPeternak,
        item.hewan.kodeEartagNasional,
        item.petugas.namaPetugas,
        item.tglVaksin
      ];
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
    link.setAttribute("download", "Vaksin.csv");
    document.body.appendChild(link);
    link.click();
  };

  componentDidMount() {
    this.getPeternaks();
    this.getPetugas();

    reqUserInfo()
      .then((response) => {
        const user = response.data;
      this.setState({ user }, () => {
        if (user.role === 'ROLE_PETERNAK') {
          this.getVaksinByPeternak(user.username);
        } else {
          this.getVaksins();
        }
        
      });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }

  render() {
    const { vaksins, peternaks, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      {title:"ID Vaksin", dataIndex:"idVaksin", key:"idVaksin"},
      {title:"Nama Vaksin", dataIndex:"namaVaksin", key:"namaVaksin"},
      {title:"Jenis Vaksin", dataIndex:"jenisVaksin", key:"jenisVaksin"},
      {title:"Kode Eartag", dataIndex:"hewan.kodeEartagNasional", key:"kodeEartagNasional"},
      {title:"Nama Peternak", dataIndex:"peternak.namaPeternak", key:"namaPeternak"},
      {title:"NIK Peternak", dataIndex:"peternak.nikPeternak", key:"nikPeternak"},
      {title:"Lokasi", dataIndex:"peternak.lokasi", key:"lokasi"},
      {title:"inseminator", dataIndex:"petugas.namaPetugas", key:"inseminator"},
      {title:"Tanggal Vaksin", dataIndex:"tglVaksin", key:"tglVaksin"},
    ];

    const renderTable = () => {
      if (user &&  user.role === 'ROLE_PETERNAK') {
        return <Table dataSource={vaksins} bordered columns={columns} />;
      } else if (user && user.role === 'ROLE_ADMINISTRATOR' || 'ROLE_PETUGAS') {
        return <Table dataSource={vaksins} bordered columns={(columns && renderColumns())}/>
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
              <Button type="primary" onClick={this.handleAddVaksin}>
                Tambah Vaksin
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
                onClick={() => this.handleEditVaksin(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                title="Delete"
                onClick={() => this.handleDeleteVaksin(row)}
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
    const cardContent = `Di sini, Anda dapat mengelola daftar vaksin di sistem.`;

    return (
      <div className="app-container">
        <TypingCard title="Manajemen Vaksin Buatan" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
        </Card>
        <EditVaksinForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editVaksinFormRef = formRef)
          }
          visible={this.state.editVaksinModalVisible}
          confirmLoading={this.state.editVaksinModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditVaksinOk}
        />
        <AddVaksinForm
          wrappedComponentRef={(formRef) =>
            (this.addVaksinFormRef = formRef)
          }
          visible={this.state.addVaksinModalVisible}
          confirmLoading={this.state.addVaksinModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddVaksinOk}
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

export default Vaksin;
