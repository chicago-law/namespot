import React from 'react'

interface Props {
  children: React.ReactChild;
}

const ModalContent = ({ children }: Props) => (
  <>
    {children}
  </>
)

export default ModalContent
