import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getBerita,
  deleteBerita,
  editBerita,
  addBerita
} from "@/api/berita";
import TypingCard from "@/components/TypingCard";
import EditBeritaForm from "./forms/edit-berita-form";
import AddBeritaForm from "./forms/add-berita-form";
import { reqUserInfo } from "../../api/user";
import imgUrl from "../../utils/imageURL";

class Berita extends Component {
  state = {
    berita: [],
    editBeritaModalVisible: false,
    editBeritaModalLoading: false,
    currentRowData: {},
    addBeritaModalVisible: false,
    addBeritaModalLoading: false,
    searchKeyword: "",
  };

  getBerita = async () => {
    const result = await getBerita();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredBerita = content.filter((berita) => {
        const { judul, pembuat} = berita;
        const keyword = this.state.searchKeyword.toLowerCase();
        
        const isJudulBeritaValid = typeof judul === 'string';
        const isPembuatValid = typeof pembuat === 'string';
      
        return (
          (isJudulBeritaValid && judul.toLowerCase().includes(keyword)) ||
          (isPembuatValid && pembuat.toLowerCase().includes(keyword))
        );
      });
  
      this.setState({
        berita: filteredBerita,
      });
    }
  };

  handleSearch = (keyword) => {
    this.setState({
      searchKeyword: keyword,
    }, () => {
      this.getBerita(); 
    });
  };

  handleEditBerita = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editBeritaModalVisible: true,
    });
  };

  handleDeleteBerita = (row) => {
    const { idBerita } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteBerita({ idBerita }).then((res) => {
          message.success("Berhasil dihapus");
          this.getBerita();
        });
      },
    });
  };

  handleEditBeritaOk = (_) => {
    const { form } = this.editBeritaFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editBerita(values, values.idBerita)
        .then((response) => {
          form.resetFields();
          this.setState({
            editBeritaModalVisible: false,
            editBeritaModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getBerita();
        })
        .catch((e) => {
          message.success("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editBeritaModalVisible: false,
      addBeritaModalVisible: false,
    });
  };

  handleAddBerita = (row) => {
    this.setState({
      addBeritaModalVisible: true,
    });
  };

  handleAddBeritaOk = (_) => {
    const { form } = this.addBeritaFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addBeritaModalLoading: true });
      addBerita(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addBeritaModalVisible: false,
            addBeritaModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getBerita();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, harap coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getBerita();
    
    reqUserInfo()
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }
  render() {
    const { berita,  searchKeyword, user } = this.state;
    const columns = [
      { title: "Judul Berita", dataIndex: "judul", key: "judul" },
      { title: "Tanggal Pembuatan", dataIndex: "tglPembuatan", key: "tglPembuatan" },
      {
        title: "Isi Berita",
        dataIndex: "isiBerita",
        key: "isiBerita",
        render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
      },
      { title: "Creator", dataIndex: "pembuat", key: "pembuat" },
      { title: "Foto Berita", dataIndex: "file_path", key: "file_path",  render: (text, row) => (
        <img
          src={`${imgUrl}${row.file_path}`}
          width={200}
          height={150}
        />
      ),},
    ];

    const renderTable = () => {
      if (user &&  user.role === 'ROLE_PETERNAK') {
        return <Table dataSource={berita} bordered columns={columns} />;
      } else if (user && user.role === 'ROLE_ADMINISTRATOR' || 'ROLE_PETUGAS') {
        return <Table dataSource={berita} bordered columns={(columns && renderColumns())}/>
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
              <Button type="primary" onClick={this.handleAddBerita}>
                Tambah Berita
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
          width: 120,
          align: "center",
          render: (text, row) => (
            <span>
              <Button
                type="primary"
                shape="circle"
                icon="edit"
                title="Edit"
                onClick={() => this.handleEditBerita(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                title="Delete"
                onClick={() => this.handleDeleteBerita(row)}
              />
            </span>
          ),
        });
      }
      return columns;
    };
  
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingTop: 15}}>
        {renderButtons()}
        <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Input
              placeholder="Cari data"
              value={searchKeyword}
              onChange={(e) => this.handleSearch(e.target.value)}
              style={{ width: 235, marginRight: 10 }}
            />
          </Col>
        </Row>
      </Row>
    );
  
    const { role } = user ? user.role : '';
    console.log("peran pengguna:",role);
    const cardContent = `Di sini, Anda dapat mengelola daftar berita di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Data Berita" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
        </Card>
        <EditBeritaForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editBeritaFormRef = formRef)
          }
          visible={this.state.editBeritaModalVisible}
          confirmLoading={this.state.editBeritaModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditBeritaOk}
        />
        <AddBeritaForm
          wrappedComponentRef={(formRef) =>
            (this.addBeritaFormRef = formRef)
          }
          visible={this.state.addBeritaModalVisible}
          confirmLoading={this.state.addBeritaModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddBeritaOk}
        />
      </div>
    );
  }
}

export default Berita;
