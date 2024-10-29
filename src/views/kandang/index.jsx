import React, { Component } from "react";
import {
  Card,
  Button,
  Table,
  message,
  Upload,
  Row,
  Col,
  Divider,
  Modal,
  Input,
} from "antd";
import {
  getKandang,
  getKandangByPeternak,
  deleteKandang,
  editKandang,
  addKandang,
  addKandangWithoutFile,
} from "@/api/kandang";
import TypingCard from "@/components/TypingCard";
import EditKandangForm from "./forms/edit-kandang-form";
import AddKandangForm from "./forms/add-kandang-form";
// import ViewKandangForm from "./forms/view-kandang-form";
import { read, utils } from "xlsx";
import { UploadOutlined } from "@ant-design/icons";
import { reqUserInfo } from "../../api/user";
import imgUrl from "../../utils/imageURL";

import { kandangSapi } from "../../assets/images/kandangsapi.jpg";

const { Column } = Table;
class Kandang extends Component {
  state = {
    kandangs: [],
    editKandangModalVisible: false,
    editKandangModalLoading: false,
    // viewKandangModalVisible: false,
    currentRowData: {},
    addKandangModalVisible: false,
    addKandangModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };

  getKandangByPeternak = async (peternakID) => {
    try {
      const result = await getKandangByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({ kandangs: content });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  getKandang = async () => {
    const result = await getKandang();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredKandang = content.filter((kandangs) => {
        const {
          idKandang,
          idPeternak,
          namaPeternak,
          luas,
          jenisHewan,
          kapasitas,
          nilaiBangunan,
          alamat,
          provinsi,
          kabupaten,
          kecamatan,
          desa,
        } = kandangs;
        const keyword = this.state.searchKeyword.toLowerCase();

        const isIdKandangValid = typeof idKandang === "string";
        const isIdPeternakValid = typeof idPeternak === "string";
        const isNamaPeternakValid = typeof namaPeternak === "string";
        const isLuasValid = typeof luas === "string";
        const isJenisHewan = typeof jenisHewan === "string";
        const isKapasitasValid = typeof kapasitas === "string";
        const isNilaiBangunanValid = typeof nilaiBangunan === "string";
        const isAlamatValid = typeof alamat === "string";
        const isProvinsiValid = typeof provinsi === "string";
        const isKabupatenValid = typeof kabupaten === "string";
        const isKecamatanValid = typeof kecamatan === "string";
        const isDesaValid = typeof desa === "string";

        return (
          (isIdKandangValid && idKandang.toLowerCase().includes(keyword)) ||
          (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
          (isNamaPeternakValid &&
            namaPeternak.toLowerCase().includes(keyword)) ||
          (isLuasValid && luas.toLowerCase().includes(keyword)) ||
          (isJenisHewan && jenisHewan.toLowerCase().includes(keyword)) ||
          (isKapasitasValid && kapasitas.toLowerCase().includes(keyword)) ||
          (isNilaiBangunanValid &&
            nilaiBangunan.toLowerCase().includes(keyword)) ||
          (isAlamatValid && alamat.toLowerCase().includes(keyword)) ||
          (isProvinsiValid && provinsi.toLowerCase().includes(keyword)) ||
          (isKabupatenValid && kabupaten.toLowerCase().includes(keyword)) ||
          (isKecamatanValid && kecamatan.toLowerCase().includes(keyword)) ||
          (isDesaValid && desa.toLowerCase().includes(keyword))
        );
      });

      this.setState({
        kandangs: filteredKandang,
      });
    }
  };

  handleSearch = (keyword) => {
    this.setState(
      {
        searchKeyword: keyword,
      },
      () => {
        this.getKandang();
      }
    );
  };

  handleEditKandang = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editKandangModalVisible: true,
    });
  };

  handleDeleteKandang = (row) => {
    const { idKandang } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteKandang({ idKandang }).then((res) => {
          message.success("Berhasil dihapus");
          this.getKandang();
        });
      },
    });
  };

  handleEditKandangOk = (_) => {
    const { form } = this.editKandangFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editKandang(values, values.idKandang)
        .then((response) => {
          form.resetFields();
          this.setState({
            editKandangModalVisible: false,
            editKandangModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getKandang();
        })
        .catch((e) => {
          message.error("Pengeditan gagal, harap coba lagi!");
        });
    });
  };
  // handleViewKandang = (row) => {
  //   this.setState({
  //     currentRowData: Object.assign({}, row),
  //     viewKandangModalVisible: true,
  //   });
  // };

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

  fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      } else {
        console.error(
          "No coordinates found for the provided address:",
          address
        );
        return { lat: null, lon: null };
      }
    } catch (error) {
      console.error("Error converting address to coordinates:", error);
      return { lat: null, lon: null };
    }
  };

  saveImportedData = async (columnMapping) => {
    const { importedData, kandangs } = this.state;
    let errorCount = 0;

    try {
      for (const row of importedData) {
        const address = `${row[columnMapping["Desa"]]}, ${
          row[columnMapping["Kecamatan"]]
        }, ${row[columnMapping["Kabupaten"]]}, ${
          row[columnMapping["Provinsi"]]
        }`;
        const { lat, lon } = await this.fetchCoordinates(address);

        const dataToSave = {
          idKandang: row[columnMapping["Id Kandang"]],
          peternak_id: row[columnMapping["Id Peternak"]],
          luas: row[columnMapping["Luas"]],
          jenis_id: row[columnMapping["Jenis Hewan"]],
          kapasitas: row[columnMapping["Kapasitas"]],
          nilaiBangunan: row[columnMapping["Nilai Bangunan"]],
          alamat: row[columnMapping["Alamat"]],
          latitude: lat || row[columnMapping["Latitude"]],
          longitude: lon || row[columnMapping["Longitude"]],
          file: kandangSapi,
        };

        const existingKandangIndex = kandangs.findIndex(
          (p) => p.idKandang === dataToSave.idKandang
        );
        try {
          if (existingKandangIndex > -1) {
            // Update existing data
            await editKandang(dataToSave, dataToSave.idKandang);
            this.setState((prevState) => {
              const updatedKandang = [...prevState.kandangs];
              updatedKandang[existingKandangIndex] = dataToSave;
              return { kandangs: updatedKandang };
            });
          } else {
            // Add new data
            await addKandangWithoutFile(dataToSave);
            this.setState((prevState) => ({
              kandangs: [...prevState.kandangs, dataToSave],
            }));
          }
        } catch (error) {
          errorCount++;
          console.error("Gagal menyimpan data:", error);
        }

        // Delay to avoid hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
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

  //Fungsi Export dari database ke file csv
  handleExportData = () => {
    const { kandangs } = this.state;
    const csvContent = this.convertToCSV(kandangs);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = [
      "Id Kandang",
      "Luas",
      "Kapasitas",
      "Nilai Bangunan",
      "Alamat",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.idKandang,
        item.luas,
        item.kapasitas,
        item.nilaiBangunan,
        item.alamat,
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
    link.setAttribute("download", "Kandang.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };

  handleCancel = (_) => {
    this.setState({
      editKandangModalVisible: false,
      addKandangModalVisible: false,
    });
  };

  handleAddKandang = (row) => {
    this.setState({
      addKandangModalVisible: true,
    });
  };

  handleAddKandangOk = (_) => {
    const { form } = this.addKandangFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addKandangModalLoading: true });
      const kandangData = {
        idKandang: values.idKandang,
        peternak_id: values.peternak_id,
        luas: values.luas + " m2",
        jenis_id: values.jenis_id,
        kapasitas: values.kapasitas + " ekor",
        nilaiBangunan: "Rp. " + values.nilaiBangunan,
        alamat: values.alamat,
        latitude: values.latitude,
        longitude: values.longitude,
        file: values.file,
      };

      addKandangWithoutFile(kandangData)
        .then((response) => {
          form.resetFields();
          this.setState({
            addKandangModalVisible: false,
            addKandangModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getKandang();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, harap coba lagi!");
        });
    });
  };
  componentDidMount() {
    reqUserInfo()
      .then((response) => {
        const user = response.data;
        this.setState({ user }, () => {
          if (user.role === "ROLE_PETERNAK") {
            this.getKandangByPeternak(user.username);
          } else {
            this.getKandang();
          }
        });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }
  render() {
    const { kandangs, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      { title: "Id Kandang", dataIndex: "idKandang", key: "idKandang" },
      { title: "Luas", dataIndex: "luas", key: "luas" },
      { title: "Jenis Hewan", dataIndex: "jenis.nama", key: "jenis.nama" },
      { title: "Kapasitas", dataIndex: "kapasitas", key: "kapasitas" },
      {
        title: "Nilai Bangunan",
        dataIndex: "nilaiBangunan",
        key: "nilaiBangunan",
      },
      { title: "Alamat", dataIndex: "alamat", key: "alamat" },

      {
        title: "Foto Kandang",
        dataIndex: "file_path",
        key: "file_path",

        render: (text, row) => (
          <img
            src={`${imgUrl + "/kandang/" + row.file_path}`}
            width={200}
            height={150}
          />
        ),
      },
      // <ViewKandangForm
      //   currentRowData={this.state.currentRowData}
      //   visible={this.state.viewKandangModalVisible}
      //   onCancel={() => this.setState({ viewKandangModalVisible: false })}
      // />,
    ];

    const renderTable = () => {
      if (user && user.role === "ROLE_PETERNAK") {
        return <Table dataSource={kandangs} bordered columns={columns} />;
      } else if (
        (user && user.role === "ROLE_ADMINISTRATOR") ||
        "ROLE_PETUGAS"
      ) {
        return (
          <Table
            dataSource={kandangs}
            bordered
            columns={columns && renderColumns()}
          />
        );
      } else {
        return null;
      }
    };

    const renderButtons = () => {
      if (
        user &&
        (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
      ) {
        return (
          <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button type="primary" onClick={this.handleAddKandang}>
                Tambah Kandang
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button
                icon={<UploadOutlined />}
                onClick={this.handleImportModalOpen}
              >
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
      if ((user && user.role === "ROLE_ADMINISTRATOR") || "ROLE_PETUGAS") {
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
                onClick={() => this.handleEditKandang(row)}
                // />
                // <Divider type="vertical" />
                // <Button
                //   type="primary"
                //   shape="circle"
                //   icon="eye"
                //   title="View"
                //   onClick={() => this.handleViewKandang(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                title="Delete"
                onClick={() => this.handleDeleteKandang(row)}
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

    const { role } = user ? user.role : "";
    console.log("peran pengguna:", role);
    const cardContent = `Di sini, Anda dapat mengelola daftar kandang di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Data Kandang" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
          {renderTable()}
        </Card>
        <EditKandangForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.editKandangFormRef = formRef)}
          visible={this.state.editKandangModalVisible}
          confirmLoading={this.state.editKandangModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditKandangOk}
        />

        <AddKandangForm
          wrappedComponentRef={(formRef) => (this.addKandangFormRef = formRef)}
          visible={this.state.addKandangModalVisible}
          confirmLoading={this.state.addKandangModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddKandangOk}
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

export default Kandang;
