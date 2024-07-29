import React, { Component } from "react";
import { Card, Button, Table, message, Row, Col, Divider, Modal, Upload, Input } from "antd";
import { getPkb, getPkbByPeternak, deletePkb, editPkb, addPkb } from "@/api/pkb";
import {getPetugas} from "@/api/petugas";
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { read, utils } from "xlsx";
import TypingCard from "@/components/TypingCard";
import EditPkbForm from "./forms/edit-pkb-form";
import AddPkbForm from "./forms/add-pkb-form";
import { reqUserInfo } from "../../api/user";

const { Column } = Table;

class Pkb extends Component {
  state = {
    pkb: [],
    petugas: [],
    editPkbModalVisible: false,
    editPkbModalLoading: false,
    currentRowData: {},
    addPkbModalVisible: false,
    addPkbModalLoading: false,
    importModalVisible: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    columnMapping: {},
    searchKeyword: "", 
    user: null,
  };

  // Fungsi ambil data dari database
  getPkb = async () => {
    const result = await getPkb();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredPKB = content.filter((pkb) => {
        const { idKejadian, idPeternak, kodeEartagNasional, tanggalPkb,
        lokasi, namaPeternak, nikPeternak, 
        spesies, kategori, pemeriksaKebuntingan } = pkb;
        const keyword = this.state.searchKeyword.toLowerCase();
        
        const isIdKejadianValid = typeof idKejadian === 'string';
        const isIdPeternakValid = typeof idPeternak === 'string';
        const isKodeEartagNasionalValid = typeof kodeEartagNasional === 'string';
        const isTanggalPKBValid = typeof tanggalPkb === 'string';
        const isLokasiValid = typeof lokasi === 'string';
        const isNamaPeternakValid = typeof namaPeternak === 'string';
        const isNikPeternakValid = typeof nikPeternak === 'string';
        const isSpesiesValid = typeof spesies === 'string';
        const isKategoriValid = typeof kategori === 'string';
        const isPemeriksaKebuntinganValid = typeof pemeriksaKebuntingan === 'string';

        return (
          (isIdKejadianValid && idKejadian.toLowerCase().includes(keyword)) ||
          (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
          (isKodeEartagNasionalValid && kodeEartagNasional.toLowerCase().includes(keyword)) ||
          (isTanggalPKBValid && tanggalPkb.toLowerCase().includes(keyword)) ||
          (isLokasiValid && lokasi.toLowerCase().includes(keyword)) ||
          (isNamaPeternakValid && namaPeternak.toLowerCase().includes(keyword)) ||
          (isNikPeternakValid && nikPeternak.toLowerCase().includes(keyword)) ||
          (isSpesiesValid && spesies.toLowerCase().includes(keyword)) ||
          (isKategoriValid && kategori.toLowerCase().includes(keyword)) ||
          (isPemeriksaKebuntinganValid && pemeriksaKebuntingan.toLowerCase().includes(keyword))
        );
      });
  
      this.setState({
        pkb: filteredPKB,
      });
    }
  };

  getPkbByPeternak = async (peternakID) => {
    try {
      const result = await getPkbByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({ pkb: content });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
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
      this.getPkb(); 
    });
  };

  // Fungsi Import File Csv
  handleImportModalOpen = () => {
    this.setState({ importModalVisible: true });
  };

  handleImportModalClose = () => {
    this.setState({ importModalVisible: false });
  };

  // Fungsi Edit Pkb
  handleEditPkb = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editPkbModalVisible: true,
    });
  };

  handleEditPkbOk = (_) => {
    const { form } = this.editPkbFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editPkb(values, values.idKejadian)
        .then((response) => {
          form.resetFields();
          this.setState({
            editPkbModalVisible: false,
            editPkbModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getPkb();
        })
        .catch((e) => {
          message.error("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

  handleDeletePkb = (row) => {
    const { idKejadian } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deletePkb({ idKejadian }).then((res) => {
          message.success("Berhasil dihapus");
          this.getPkb();
        });
      },
    });
  };

  handleAddPkb = (row) => {
    this.setState({
      addPkbModalVisible: true,
    });
  };

  handleAddPkbOk = (_) => {
    const { form } = this.addPkbFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addPkbModalLoading: true });
      addPkb(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addPkbModalVisible: false,
            addPkbModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getPkb();
        })
        .catch((e) => {
          message.error("Gagal menambahkan, harap coba lagi!");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editPkbModalVisible: false,
      addPkbModalVisible: false,
    });
  };

  componentDidMount() {
    this.getPetugas();

    reqUserInfo()
      .then((response) => {
        const user = response.data;
      this.setState({ user }, () => {
        if (user.role === 'ROLE_PETERNAK') {
          this.getPkbByPeternak(user.username);
        } else {
          this.getPkb();
        }
        
      });
    })
    .catch((error) => {
      console.error("Terjadi kesalahan saat mengambil data user:", error);
    });
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
    const { importedData, pkb, petugas } = this.state;
    let errorCount = 0;
  
    try {
      for (const row of importedData) {
        const petugasNama = row[columnMapping["Pemeriksa Kebuntingan"]].toLowerCase();
        const petugasData = petugas.find(p => p.namaPetugas.toLowerCase() === petugasNama);
        const petugasId = petugasData ? petugasData.nikPetugas : null;
        console.log(`Mencocokkan nama petugas: ${petugasNama}, Ditemukan: ${petugasData ? 'Ya' : 'Tidak'}, petugasId: ${petugasId}`);
        const dataToSave = {
          idKejadian: row[columnMapping["ID Kejadian"]],
          tanggalPkb: this.convertToJSDate(row[columnMapping["Tanggal PKB"]]),
          peternak_id: row[columnMapping["ID Peternak"]],
          hewan_id: row[columnMapping["ID Hewan"]],
          spesies: row[columnMapping["Spesies"]],
          umurKebuntingan: row[columnMapping["Umur Kebuntingan saat PKB (bulan)"]],
          petugas_id: petugasId,
        };
        const existingPkbIndex = pkb.findIndex(p => p.idKejadian === dataToSave.idKejadian);
  
        try {
          if (existingPkbIndex > -1) {
            // Update existing data
            await editPkb(dataToSave, dataToSave.idKejadian);
            this.setState((prevState) => {
              const updatedPkb = [...prevState.pkb];
              updatedPkb[existingPkbIndex] = dataToSave;
              return { pkb: updatedPkb };
            });
          } else {
            // Add new data
            await addPkb(dataToSave);
            this.setState((prevState) => ({
              pkb: [...prevState.pkb, dataToSave],
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

  // Fungsi Export dari database ke file csv
  handleExportData = () => {
    const { pkb } = this.state;
    const csvContent = this.convertToCSV(pkb);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = [
      "ID Kejadian",
      "Tanggal PKB",
      "Lokasi",
      "Nama Peternak",
      "ID Peternak",
      "NIK Peternak",
      "ID Hewan",
      "Spesies",
      "Kategori",
      "Jumlah",
      "Umur Kebuntingan saat PKB (bulan)",
      "Pemeriksa Kebuntingan",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.idKejadian,
        item.tanggalPkb,
        item.lokasi,
        item.namaPeternak,
        item.idPeternak,
        item.nikPeternak,
        item.kodeEartagNasional,
        item.spesies,
        item.kategori,
        item.jumlah,
        item.umurKebuntingan,
        item.pemeriksaKebuntingan
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
    link.setAttribute("download", "Pkb.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };

  render(){
    const { pkb, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      { title: "ID Kejadian", dataIndex: "idKejadian", key: "idKejadian" },
      { title: "Tanggal PKB", dataIndex: "tanggalPkb", key: "tanggalPkb" },
      { title: "Lokasi", dataIndex: "peternak.lokasi", key: "lokasi" },
      { title: "Nama Peternak", dataIndex: "peternak.namaPeternak", key: "namaPeternak" },
      { title: "ID Peternak", dataIndex: "peternak.idPeternak", key: "idPeternak" },
      { title: "ID Hewan", dataIndex: "hewan.kodeEartagNasional", key: "kodeEartagNasional" },
      { title: "Spesies", dataIndex: "spesies", key: "spesies" },
      { title: "Umur Kebuntingan", dataIndex: "umurKebuntingan", key: "umurKebuntingan" },
      { title: "Pemeriksa Kebuntingan", dataIndex: "petugas.namaPetugas", key: "pemeriksaKebuntingan" }

    ];

    const renderTable = () => {
      if (user &&  user.role === 'ROLE_PETERNAK') {
        return <Table dataSource={pkb} bordered columns={columns} />;
      } else if (user && user.role === 'ROLE_ADMINISTRATOR' || 'ROLE_PETUGAS') {
        return <Table dataSource={pkb} bordered columns={(columns && renderColumns())}/>
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
              <Button type="primary" onClick={this.handleAddPkb}>
                Tambah PKB
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
                onClick={() => this.handleEditPkb(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                title="Delete"
                onClick={() => this.handleDeletePkb(row)}
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
    const cardContent = `Di sini, Anda dapat mengelola daftar pkb di sistem.`;
    return (
      <div className="app-container">
        {/* TypingCard component */}
        
        <TypingCard title="Manajemen Hewan" source={cardContent} />
        <br />

        <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
        </Card>

        <EditPkbForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editPkbFormRef = formRef)
          }
          visible={this.state.editPkbModalVisible}
          confirmLoading={this.state.editPkbModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditPkbOk}
        />
        <AddPkbForm
          wrappedComponentRef={(formRef) =>
            (this.addPkbFormRef = formRef)
          }
          visible={this.state.addPkbModalVisible}
          confirmLoading={this.state.addPkbModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddPkbOk}
        />

        {/* Modal Import */}
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

export default Pkb;
