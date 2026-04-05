import {Card, Col, Row} from 'antd'
import React from 'react'
import ValidationCard from '../ValidationCard'

const groupName = 'EFOS'

export default function EFOS() {
  return (
    <Col span={24}>
      <Card>
        <div style={{marginBottom: 10}}>
          <h5>{groupName}</h5>
        </div>
        <Row gutter={[12, 12]}>
          <Col span={6}>
            <ValidationCard
              title="EFOS contra CFDIs recibidos y emitidos"
              validationId="efosContraCfdis"
              validationDomain={[]}
              cfdiTypes={[]}
              group={groupName}
            />
          </Col>
        </Row>
      </Card>
    </Col>
  )
}
