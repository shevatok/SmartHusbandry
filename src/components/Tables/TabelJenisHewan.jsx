import React from "react";
import "./style.css";
import gambar from "../../assets/images/sacred-cow.png";
import { Button, Col, Row } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const TabelJenisHewan = () => {
  return (
    <div className="table-container">
      <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary">Tambah Hewan</Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button icon={<UploadOutlined />}>Import File</Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button icon={<UploadOutlined />}>Export File</Button>
        </Col>
      </Row>

      <table className="table">
        <thead>
          <tr>
            <th>Data Hewan</th>
            <th>Jenis Hewan</th>
            <th>Data Pemilik</th>
            <th>Data Kandang</th>
            <th>Jumlah Hewan</th>
            <th>Operasi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>
                <div>
                  <p>Ear Tag - 1827485493938303</p>
                </div>
              </div>
            </td>
            <td>Sapi Limosin</td>
            <td>Sevanto</td>
            <td>A7685</td>
            <td>23</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TabelJenisHewan;
