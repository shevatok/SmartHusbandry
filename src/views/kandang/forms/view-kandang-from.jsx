import React from "react";
import { Modal, Form, Descriptions } from "antd";

const ViewKandangForm = Form.create({ name: "view_kandang_form" })(
  (props) => {
    const { visible, onCancel, currentRowData } = props;

    return (
      <Modal
        visible={visible}
        title="Detail Kandang"
        onCancel={onCancel}
        footer={null}
      >
        <Descriptions bordered>
          <Descriptions.Item label="Id Kandang">
            {currentRowData.idKandang}
          </Descriptions.Item>
          <Descriptions.Item label="Luas">{currentRowData.luas}</Descriptions.Item>
          <Descriptions.Item label="Kapasitas">{currentRowData.kapasitas}</Descriptions.Item>
          <Descriptions.Item label="Nilai Bangunan">
            {currentRowData.nilaiBangunan}
          </Descriptions.Item>
          <Descriptions.Item label="Alamat">{currentRowData.alamat}</Descriptions.Item>
          <Descriptions.Item label="Latitude">{currentRowData.latitude}</Descriptions.Item>
          <Descriptions.Item label="Longitude">{currentRowData.longitude}</Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  }
);

export default ViewKandangForm;
