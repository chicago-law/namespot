import React, { useState } from 'react'
import { connect } from 'react-redux'
import ModalHeader from '../ModalHeader'
import ModalControls from '../ModalControls'
import ModalContent from '../ModalContent'
import api from '../../../utils/api'
import { updateStudent } from '../../../store/students/actions'

export interface ChangePictureModalData {
  studentId: string;
}
interface StoreProps {
  updateStudent: typeof updateStudent;
}
interface OwnProps {
  modalData: ChangePictureModalData;
}

const ChangePicture = ({
  updateStudent,
  modalData,
}: StoreProps & OwnProps) => {
  const { studentId } = modalData
  const [newPicturePath, setNewPicturePath] = useState<string | null>(null)

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const pic = e.target.files && e.target.files[0]
    if (pic) {
      const formData = new FormData()
      formData.append('newPicture', pic, pic.name)
      api.uploadPicture(formData)
        .then(({ data }) => {
          if (data.success) setNewPicturePath(data.fileName)
        })
    }
  }

  function onConfirm() {
    if (newPicturePath) {
      updateStudent(studentId, {
        picture: newPicturePath,
      })
    }
  }

  return (
    <>
      <ModalHeader title="Change Student Picture" />

      <ModalContent>
        <>
          <p>Upload a new picture for this student. Image must be PNG or JPG filetypes and under 1MB.</p>
          {newPicturePath && (
            <img
              className="picture-preview"
              style={{ display: 'block', marginBottom: '1em', maxWidth: '8em' }}
              src={`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/storage/student_pictures/${newPicturePath}`}
              alt=""
            />
          )}
          <input id="pic-id" name="pic-name" type="file" accept="image/png, image/jpeg" onChange={onFileSelect} />
        </>
      </ModalContent>

      <ModalControls handleConfirm={onConfirm} />
    </>
  )
}

export default connect(null, {
  updateStudent,
})(ChangePicture)
