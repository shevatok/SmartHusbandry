import React, { Component } from 'react'
import { Card } from 'antd'
import { connect } from 'react-redux'

import BackgroundImage from '@/assets/images/Peternakan-Sapi.jpg'
import './index.less'
class BoxCard extends Component {
  state = {}
  render() {
    return (
      <div className="box-card-component">
        <Card
          cover={
            <img
              alt="example"
              src={BackgroundImage}
              style={{ height: '100%' }}
            />
          }
        ></Card>
      </div>
    )
  }
}

export default connect((state) => state.user)(BoxCard)
