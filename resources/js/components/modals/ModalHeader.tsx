import React from 'react'

interface Props {
  title: string;
  subtitle?: string;
}

const ModalHeader = ({ title, subtitle }: Props) => (
  <div>
    <h1 style={{ marginTop: '0' }}>{title}</h1>
    {subtitle && (
      <h3>{subtitle}</h3>
    )}
  </div>
)

export default ModalHeader
