import React, { Component } from "react";
import { Card, Button, Table, message, Row, Col, Divider, Modal, Upload, Input } from "antd";
import { getPeternaks } from "@/api/peternak";
import { getInseminasis, 
  getInseminasiByPeternak,
        deleteInseminasi, 
        editInseminasi, 
        addInseminasi } from "@/api/inseminasi";
import {getPetugas} from "@/api/petugas";
import { UploadOutlined } from '@ant-design/icons';
import { read, utils } from "xlsx";
import moment from 'moment';
import AddInseminasiBuatanForm from './forms/add-inseminasi-form';
import EditInseminasiBuatanForm from './forms/edit-inseminasi-form';
import TypingCard from "@/components/TypingCard";
import { reqUserInfo } from "../../api/user";

const { Column } = Table;
class InseminasiBuatan extends Component {
  state = {
    inseminasis: [],
    peternaks: [],
    petugas: [],
    editInseminasiModalVisible: false,
    editInseminasiModalLoading: false,
    currentRowData: {},
    addInseminasiModalVisible: false,
    addInseminasiModalLoading: false,
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

  getInseminasis = async () => {
    const result = await getInseminasis();

    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredInseminasi = content.filter((inseminasis) => {
        const { idInseminasi, idPeternak,  namaPeternak, kodeEartagNasional,
        idPejantan, idPembuatan, bangsaPejantan, produsen, inseminator, lokasi } = inseminasis;
        const keyword = this.state.searchKeyword.toLowerCase();
        
        const isIdInseminasiValid = typeof idInseminasi === 'string';
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
          (isIdInseminasiValid && idInseminasi.toLowerCase().includes(keyword)) ||
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
        inseminasis: filteredInseminasi,
      });
    }
  };

  getInseminasiByPeternak = async (peternakID) => {
    try {
      const result = await getInseminasiByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({ inseminasis: content });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  handleSearch = (keyword) => {
    this.setState({
      searchKeyword: keyword,
    }, () => {
      this.getInseminasis(); 
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

  handleEditInseminasi = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editInseminasiModalVisible: true,
    });
  };

  handleEditInseminasiOk = (_) => {
    const { form } = this.editInseminasiFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editInseminasiModalLoading: true });
      editInseminasi(values, values.idInseminasi)
        .then((response) => {
          form.resetFields();
          this.setState({
            editInseminasiModalVisible: false,
            editInseminasiModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getInseminasis();
        })
        .catch((e) => {
          message.success("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

  handleDeleteInseminasi = (row) => {
    const { idInseminasi } = row;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteInseminasi({ idInseminasi }).then((res) => {
          message.success("Berhasil dihapus");
          this.getInseminasis();
        });
      },
    });
  };

  handleCancel = (_) => {
    this.setState({
      editInseminasiModalVisible: false,
      addInseminasiModalVisible: false,
      importModalVisible: false,
    });
  };

  handleAddInseminasi = (row) => {
    this.setState({
      addInseminasiModalVisible: true,
    });
  };

  handleAddInseminasiOk = (_) => {
    const { form } = this.addInseminasiFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addInseminasiModalLoading: true });
      addInseminasi(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addInseminasiModalVisible: false,
            addInseminasiModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getInseminasis();
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
    const { importedData, inseminasis, petugas } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const petugasNama = row[columnMapping["Inseminator"]]?.toLowerCase();
        const petugasData = petugas.find(p => p.namaPetugas.toLowerCase() === petugasNama);
        const petugasId = petugasData ? petugasData.nikPetugas : null;
        console.log(`Mencocokkan nama petugas: ${petugasNama}, Ditemukan: ${petugasData ? 'Ya' : 'Tidak'}, petugasId: ${petugasId}`);
        const dataToSave = {
          idInseminasi: row[columnMapping["ID"]],
          tanggalIB: this.convertToJSDate(row[columnMapping["Tanggal IB"]]),
          peternak_id: row[columnMapping["ID Peternak"]],
          hewan_id:  row[columnMapping["ID Hewan"]],
          ib: row[columnMapping["IB 1"]],
          idPejantan: row[columnMapping["ID Pejantan"]],
          idPembuatan: row[columnMapping["ID Pembuatan"]],
          bangsaPejantan: row[columnMapping["Bangsa Pejantan"]],
          produsen: row[columnMapping["Produsen"]],
          petugas_id: petugasId,
        };
        const existingInseminasiIndex = inseminasis.findIndex(p => p.idInseminasi === dataToSave.idInseminasi);
  
        try {
          if (existingInseminasiIndex > -1) {
            // Update existing data
            await editInseminasi(dataToSave, dataToSave.idInseminasi);
            this.setState((prevState) => {
              const updatedInseminasi = [...prevState.inseminasis];
              updatedInseminasi[existingInseminasiIndex] = dataToSave;
              return { inseminasis: updatedInseminasi };
            });
          } else {
            // Add new data
            await addInseminasi(dataToSave);
            this.setState((prevState) => ({
              inseminasis: [...prevState.inseminasis, dataToSave],
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
    const { inseminasis } = this.state;
    const csvContent = this.convertToCSV(inseminasis);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = [
      "ID Inseminasi",
      "Tanggal IB",
      "Lokasi",
      "Nama Peternak",
      "ID Peternak",
      "ID Hewan",
      "Eartag",
      "IB",
      "ID Pejantan",
      "ID Pembuatan",
      "Bangsa Pejantan",
      "Produsen",
      "Inseminator",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.idInseminasi,
        item.tanggalIB,
        item.alamat,
        item.namaPeternak,
        item.idPeternak,
        item.kodeEartagNasional,
        item.ib,
        item.idPejantan,
        item.idPembuatan,
        item.bangsaPejantan,
        item.produsen,
        item.inseminator,
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
    link.setAttribute("download", "Inseminasi.csv");
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
          this.getInseminasiByPeternak(user.username);
        } else {
          this.getInseminasis();
        }
        
      });
    })
    .catch((error) => {
      console.error("Terjadi kesalahan saat mengambil data user:", error);
    });
  }

  render() {
    const { inseminasis, peternaks, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      {title:"ID Inseminasi", dataIndex:"idInseminasi", key:"idInseminasi"},
      {title:"Tanggal IB", dataIndex:"tanggalIB", key:"tanggalIB"},
      {title:"Nama Peternak", dataIndex:"peternak.namaPeternak", key:"namaPeternak"},
      {title:"NIK Peternak", dataIndex:"peternak.nikPeternak", key:"nikPeternak"},
      {title:"Lokasi", dataIndex:"peternak.lokasi", key:"lokasi"},
      {title:"Kode Eartag", dataIndex:"hewan.kodeEartagNasional", key:"kodeEartagNasional"},
      {title:"IB", dataIndex:"ib", key:"ib"},
      {title:"ID Pejantan", dataIndex:"idPejantan", key:"idPejantan"},
      {title:"ID Pembuatan", dataIndex:"idPembuatan", key:"idPembuatan"},
      {title:"Bangsa Pejantan", dataIndex:"bangsaPejantan", key:"bangsaPejantan"},
      {title:"Produsen", dataIndex:"produsen", key:"produsen"},
      {title:"inseminator", dataIndex:"petugas.namaPetugas", key:"inseminator"},
    ];

    const renderTable = () => {
      if (user &&  user.role === 'ROLE_PETERNAK') {
        return <Table dataSource={inseminasis} bordered columns={columns} />;
      } else if (user && user.role === 'ROLE_ADMINISTRATOR' || 'ROLE_PETUGAS') {
        return <Table dataSource={inseminasis} bordered columns={(columns && renderColumns())}/>
      }
      else {
        return null;
      }
    };
  
    const renderButtons = () => {
      if (user && (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')){
        return (
          <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button type="primary" onClick={this.handleAddInseminasi}>
                Tambah Inseminasi Buatan
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
                onClick={() => this.handleEditInseminasi(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                title="Delete"
                onClick={() => this.handleDeleteInseminasi(row)}
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
    const cardContent = `Di sini, Anda dapat mengelola daftar inseminasi di sistem.`;

    return (
      <div className="app-container">
        <TypingCard title="Manajemen Inseminasi Buatan" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
        </Card>
        <EditInseminasiBuatanForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editInseminasiFormRef = formRef)
          }
          visible={this.state.editInseminasiModalVisible}
          confirmLoading={this.state.editInseminasiModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditInseminasiOk}
        />
        <AddInseminasiBuatanForm
          wrappedComponentRef={(formRef) =>
            (this.addInseminasiFormRef = formRef)
          }
          visible={this.state.addInseminasiModalVisible}
          confirmLoading={this.state.addInseminasiModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddInseminasiOk}
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

export default InseminasiBuatan;
