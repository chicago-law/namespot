import React, { useState, useRef, useEffect, ChangeEvent } from 'react'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import ModalContent from '../ModalContent'

export interface EditTextInputModalData {
  title: string;
  subtitle?: string;
  p?: string;
  previousValue: string;
  onConfirm: (text: string) => void;
}
interface OwnProps {
  modalData: EditTextInputModalData;
}

const EditTextInput = ({
  modalData,
}: OwnProps) => {
  const {
    title,
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
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          />
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

export default EditTextInput
