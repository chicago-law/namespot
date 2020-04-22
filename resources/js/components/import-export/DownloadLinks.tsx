import React from 'react'
import { DataCats } from '../../utils/api'
import TextButton from '../TextButton'

interface OwnProps {
  type: DataCats;
}

const DownloadLinks = ({ type }: OwnProps) => {
  function handleDownload() {
    window.open(`/templates/${type}_template.csv`)
  }

  function handleExport() {
    window.open(`/api/export/${type}`)
  }

  return (
    <>
      <TextButton
        leftIcon={['far', 'arrow-to-bottom']}
        text="Download Template"
        clickHandler={handleDownload}
        variant="clear"
      />
      <TextButton
        leftIcon={['far', 'table']}
        text={`Export All ${type}`}
        clickHandler={handleExport}
        variant="clear"
      />
    </>
  )
}

export default DownloadLinks
