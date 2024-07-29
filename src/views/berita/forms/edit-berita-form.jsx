import React, { Component } from "react";
import { Form, Input, Modal, Select, Space, Button, Upload, Icon } from "antd";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

class EditBeritaForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } =
      this.props;
    const { getFieldDecorator } = form;
    const {
      idBerita,
      judul,
      tglPembuatan,
      isiBerita,
      pembuat,
    } = currentRowData;
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
        title="Edit Data Berita"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form form={formItemLayout} name="validateOnly" layout="vertical" autoComplete="off">
            <Form.Item label="ID Berita:">
                {getFieldDecorator("idBerita", {
                  initialValue: idBerita,
                })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="Judul Berita">
                {getFieldDecorator("judul", {
                initialValue: judul,
                })(<Input placeholder="Masukkan Judul Berita!" />)}
            </Form.Item>
            <Form.Item label="Tanggal Pembuatan">
                {getFieldDecorator("tglPembuatan", {
                initialValue: tglPembuatan,
                })(<Input type="date" placeholder="Masukkan Tanggal Berita!" />)}
            </Form.Item>
            <Form.Item label="Isi Berita">
                {getFieldDecorator("isiBerita", {
                initialValue: isiBerita,
                })(<ReactQuill theme="snow"/>)}
            </Form.Item>
            <Form.Item label="Creator">
                {getFieldDecorator("pembuat", {
                initialValue: pembuat,
                })(<Input placeholder="Masukkan Creator!" />)}
            </Form.Item>
            <Form.Item label="Foto Berita" name="file">
            {getFieldDecorator("file")(
              <Upload.Dragger
              beforeUpload={() => false}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
            </Upload.Dragger>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditBeritaForm" })(EditBeritaForm);
