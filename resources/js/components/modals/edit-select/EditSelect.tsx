import React, { useState, useRef, useEffect } from 'react'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import ModalContent from '../ModalContent'

export interface EditSelectModalData {
  title: string;
  options: {
    value: string;
    label: string;
  }[];
  subtitle?: string;
  p?: string;
  previousValue: string;
  onConfirm: (text: string) => void;
}
interface OwnProps {
  modalData: EditSelectModalData;
}

const EditSelect = ({
  modalData,
}: OwnProps) => {
  const {
    title,
    options,
    subtitle = undefined,
    p = undefined,
    previousValue = '',
    onConfirm,
  } = modalData
  const [text, setText] = useState(previousValue)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  })

  function handleConfirm() {
    onConfirm(text)
  }

  return (
    <>
      <ModalHeader title={title} subtitle={subtitle} />

      <ModalContent>
        <>
          {p && (
            <p>{p}</p>
          )}
          <select
            value={text}
            onChange={(e) => setText(e.target.value)}
          >
            <option value="">--</option>
            {options.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      </ModalContent>

      <ModalControls
        confirmText="Save"
        handleConfirm={handleConfirm}
        returnKeyConfirms
      />
    </>
  )
}

export default EditSelect
