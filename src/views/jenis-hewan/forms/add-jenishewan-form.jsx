/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd'

class AddJenisHewanForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 19 },
        sm: { span: 17 },
      },
    }

    return (
      <Modal
        title="Tambah Jenis Hewan"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Jenis Hewan:">
            {getFieldDecorator('jenis', {
              rules: [{ required: true, message: 'Silahkan jenis hewan' }],
            })(<Input placeholder="Masukkan jenis hewan" />)}
          </Form.Item>
          <Form.Item label="Deskripsi:">
            {getFieldDecorator('deskripsi', {
              rules: [
                {
                  required: true,
                  message: 'Silahkan masukkan deskripsi jenis hewan',
                },
              ],
            })(<Input placeholder="Masukkan deskripsi jenis hewan" />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create({ name: 'AddHewanForm' })(AddJenisHewanForm)
