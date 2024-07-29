import React, { Component } from "react";
import { Form, Input, Modal, Upload, Select, Icon } from "antd";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

class AddBeritaForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
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
        title="Tambah Data Berita"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form form={formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="ID Berita:">
            {getFieldDecorator("idBerita", {
                rules: [{ required: true, message: "Masukkan id berita!" }],
            }
            )(<Input placeholder="Masukkan id berita" />)}
          </Form.Item>
          <Form.Item label="Judul Berita:">
            {getFieldDecorator("judul", {
                rules: [{ required: true, message: "Masukkan judul berita!" }],
            }
            )(<Input placeholder="Masukkan judul berita" />)}
          </Form.Item>
          <Form.Item label="Tanggal Pembuatan:">
            {getFieldDecorator(
              "tglPembuatan",
              {}
            )(<Input type="date" placeholder="Masukkan Tanggal Pembuatan" />)}
          </Form.Item>

          <Form.Item label="Isi Berita:">
            {getFieldDecorator("isiBerita", {
            })(<ReactQuill theme="snow"/>)}
          </Form.Item>
          <Form.Item label="Creator:">
            {getFieldDecorator("pembuat", {
            })(<Input placeholder="Masukkan creator" />)}
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

export default Form.create({ name: "AddBeritaForm" })(AddBeritaForm);
