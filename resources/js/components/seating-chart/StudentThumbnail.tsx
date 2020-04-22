import React from 'react'
import { Student } from '../../store/students/types'
import styled from '../../utils/styledComponents'

const Container = styled('div')`
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  img {
    /* The image is only here to detect a 404 error. */
    display: none !important;
  }
`

interface OwnProps {
  student: Student;
  onClick?: (e: React.MouseEvent) => void;
}

const StudentThumbnail = ({
  student,
  onClick,
}: OwnProps) => {
  function handleImageError(target: HTMLImageElement) {
    const container = target.parentElement
    const fallbackPath = `url("${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/storage/student_pictures/no-face.png")`
    if (container) {
      if (container.style.backgroundImage !== fallbackPath) {
        container.style.backgroundImage = fallbackPath
      }
    }
  }

  return (
    <Container
      className="student-thumbnail"
      onClick={(e: React.MouseEvent) => (onClick ? onClick(e) : false)}
      aria-hidden="true"
      style={{ backgroundImage: `url(${`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/storage/student_pictures/${student.picture}`})` }}
    >
      <img
        src={`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/storage/student_pictures/${student.picture}`}
        aria-hidden="true"
        alt=""
        onError={e => handleImageError(e.target as HTMLImageElement)}
      />
    </Container>
  )
}

export default React.memo(StudentThumbnail)
