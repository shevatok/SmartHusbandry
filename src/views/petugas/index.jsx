import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getPetugas,
  deletePetugas,
  editPetugas,
  addPetugas,
} from "@/api/petugas";
import TypingCard from "@/components/TypingCard";
import EditPetugasForm from "./forms/edit-petugas-form";
import AddPetugasForm from "./forms/add-petugas-form";
import { read, utils } from "xlsx";
import { UploadOutlined } from '@ant-design/icons';
import { reqUserInfo } from "../../api/user";


const { Column } = Table;
class Petugas extends Component {
  state = {
    petugas: [],
    editPetugasModalVisible: false,
    editPetugasModalLoading: false,
    currentRowData: {},
    addPetugasModalVisible: false,
    addPetugasModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
    user: null,
  };

  componentDidMount() {
    this.getPetugas();
    reqUserInfo()
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }

  getPetugas = async () => {
    const result = await getPetugas();
    console.log(result);
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
      const filteredPetugas = content.filter((petugas) => {
        const { nikPetugas, namaPetugas, email } = petugas;
        const keyword = this.state.searchKeyword.toLowerCase();
        const isNikPetugasValid = typeof nikPetugas === 'string';
        const isNamaPetugasValid = typeof namaPetugas === 'string';
        const isEmailValid = typeof email === 'string';

        return (
          (isNikPetugasValid && nikPetugas.toLowerCase().includes(keyword)) ||
          (isNamaPetugasValid && namaPetugas.toLowerCase().includes(keyword)) ||
          (isEmailValid && email.toLowerCase().includes(keyword))
        );
      });

      this.setState({ petugas: filteredPetugas });
    }
  };

  handleSearch = (keyword) => {
    this.setState({ searchKeyword: keyword }, () => {
      this.getPetugas();
    });
  };

  handleAddPetugas = (row) => {
    this.setState({
      addPetugasModalVisible: true,
    });
  };
  handleclosePetugas = (row) => {
    this.setState({
      addPetugasModalVisible: false,
    });
  };

  handleAddPetugasOk = (_) => {
    const { form } = this.addPetugasFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addPetugasModalLoading: true });
      addPetugas(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addPetugasModalVisible: false,
            addPetugasModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getPetugas();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, harap coba lagi!");
        });
    });
  };



  handleEditPetugas = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editPetugasModalVisible: true,
    });
  };

  handleDeletePetugas = (row) => {
    const { nikPetugas } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deletePetugas({ nikPetugas }).then((res) => {
          message.success("Berhasil dihapus");
          this.getPetugas();
        });
      },
    });
  };

  handleEditPetugasOk = (_) => {
    const { form } = this.editPetugasFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editPetugasModalLoading: true });
      editPetugas(values, values.nikPetugas)
        .then((response) => {
          form.resetFields();
          this.setState({
            editPetugasModalVisible: false,
            editPetugasModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getPetugas();
        })
        .catch((e) => {
          message.success("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

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
      const fileName = file.name.toLowerCase();

      const columnMapping = {};
      columnTitles.forEach((title, index) => {
        columnMapping[title] = index;
      });

      this.setState({
        importedData,
        columnTitles,
        fileName,
        columnMapping,
      });
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
    const { importedData, petugas } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const dataToSave = {
          nikPetugas: row[columnMapping["NIK Petugas Pendataan*)"]],
          namaPetugas: row[columnMapping["Nama Petugas Pendataan*)"]],
          noTelp: row[columnMapping["No. Telp Petugas Pendataan*)"]],
          email: row[columnMapping["Email Petugas Pendataan"]],
        };
  
        // Check if data already exists
        const existingPetugasIndex = petugas.findIndex(p => p.nikPetugas === dataToSave.nikPetugas);
  
        try {
          if (existingPetugasIndex > -1) {
            // Update existing data
            await editPetugas(dataToSave, dataToSave.nikPetugas);
            this.setState((prevState) => {
              const updatedPetugas = [...prevState.petugas];
              updatedPetugas[existingPetugasIndex] = dataToSave;
              return { petugas: updatedPetugas };
            });
          } else {
            // Add new data
            await addPetugas(dataToSave);
            this.setState((prevState) => ({
              petugas: [...prevState.petugas, dataToSave],
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
    const { petugas } = this.state;
    const csvContent = this.convertToCSV(petugas);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = [
      "NIK Petugas",
      "Nama Petugas",
      "No. Telp Petugas",
      "Email Petugas",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.nikPetugas,
        item.namaPetugas,
        item.noTelp,
        item.email,
      ];
      rows.push(row);
    });

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    return csvContent;
  };

  downloadCSV = (csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute("download", "petugas.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  render() {
    const { petugas, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      { title: "NIK Petugas", dataIndex: "nikPetugas", key: "nikPetugas" },
      { title: "Nama Petugas", dataIndex: "namaPetugas", key: "namaPetugas" },
      { title: "No. Telepon Petugas", dataIndex: "noTelp", key: "noTeleponPetugas" },
      { title: "Email Petugas", dataIndex: "email", key: "emailPetugas" }

    ];

    const renderTable = () => {
      if (user &&  user.role === 'ROLE_PETUGAS') {
        return <Table dataSource={petugas} bordered columns={columns} />;
      } else if (user && user.role === 'ROLE_ADMINISTRATOR') {
        return <Table dataSource={petugas} bordered columns={(columns && renderColumns())}/>
      }
      else {
        return null;
      }
    };
  
    const renderButtons = () => {
      if (user && user.role === 'ROLE_ADMINISTRATOR') {
        return (
          <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button type="primary" onClick={this.handleAddPetugas}>
                Tambah Petugas
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
      if (user && user.role === 'ROLE_ADMINISTRATOR') {
        columns.push({
          title: "Operasi",
          key: "action",
          width: 170,
          align: "center",
          render: (text, row) => (
            <span>
              <Button
                type="primary"
                shape="circle"
                icon="edit"
                title="Edit"
                onClick={() => this.handleEditPetugas(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                title="Delete"
                onClick={() => this.handleDeletePetugas(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="eye"
                title="View"
                onClick={() => this.handleDeletePetugas(row)}
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
    const cardContent = `Di sini, Anda dapat mengelola daftar petugas di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Data Petugas" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
        </Card>
        <EditPetugasForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editPetugasFormRef = formRef)
          }
          visible={this.state.editPetugasModalVisible}
          confirmLoading={this.state.editPetugasModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditPetugasOk}
        />
        <AddPetugasForm
          wrappedComponentRef={(formRef) =>
            (this.addPetugasFormRef = formRef)
          }
          visible={this.state.addPetugasModalVisible}
          confirmLoading={this.state.addPetugasModalLoading}
          onCancel={this.handleclosePetugas}
          onOk={this.handleAddPetugasOk}
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

export default Petugas;
