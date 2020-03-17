import React from 'react'
import { connect } from 'react-redux'
import styled from '../../utils/styledComponents'
import TextButton from '../TextButton'
import { dismissModal } from '../../store/modal/actions'
import { AppState } from '../../store/index'
import { LoadingState } from '../../store/loading/types'
import useEscapeKeyListener from '../../hooks/useEscapeKeyListener'
import useReturnKeyListener from '../../hooks/useReturnKeyListener'

const Container = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3em;
  padding-bottom: 3em;
  background: rgba(255,255,255, 0.9);
  button {
    margin: 0;
  }
`

interface StoreProps {
  loading: LoadingState;
  dismissModal: typeof dismissModal;
}
interface OwnProps {
  confirmText?: string;
  handleConfirm?: Function;
  confirmButtonType?: 'button' | 'submit';
  confirmDisabled?: boolean;
  showLoading?: boolean;
  cancelText?: string;
  handleCancel?: Function;
  cancelButtonType?: 'button' | 'submit';
  deferDismissal?: boolean;
  cancelOnly?: boolean;
  returnKeyConfirms?: boolean;
}

const ModalControls = ({
  loading,
  dismissModal,
  confirmText = 'Save',
  handleConfirm,
  confirmButtonType = 'button',
  confirmDisabled,
  cancelText = 'Cancel',
  handleCancel,
  cancelButtonType = 'button',
  deferDismissal,
  showLoading,
  cancelOnly = false,
  returnKeyConfirms = true,
}: StoreProps & OwnProps) => {
  function onConfirm(e: React.MouseEvent | KeyboardEvent) {
    // We're assuming here that you don't want the click event of the modal
    // controls to bubble up to any listeners.
    e.stopPropagation()
    // If a confirm handler was passed in through props, fire that.
    if (handleConfirm) {
      handleConfirm(dismissModal)
      // Unless we're deferring dismissal, dismiss the modal.
      // If you are deferring, we assume you will dispatch dismissModal from
      // elsewhere.
      if (!deferDismissal) {
        dismissModal()
      }
    } else {
      dismissModal()
    }
  }

  function onCancel(e: React.MouseEvent | KeyboardEvent) {
    // We're assuming here that you don't want the click event of the modal
    // controls to bubble up to any listeners.
    e.stopPropagation()
    if (handleCancel) handleCancel()
    dismissModal()
  }

  function handleReturnKey(e: KeyboardEvent) {
    if (returnKeyConfirms) onConfirm(e)
  }

  useEscapeKeyListener(onCancel)
  useReturnKeyListener(handleReturnKey)

  return (
    <Container className="controls">
      <TextButton
        type={cancelButtonType}
        text={cancelText}
        variant="clear"
        clickHandler={(e) => onCancel(e)}
      />
      {!cancelOnly && (
        <TextButton
          type={confirmButtonType}
          text={confirmText}
          variant="red"
          clickHandler={(e) => onConfirm(e)}
          disabled={confirmDisabled}
          loading={showLoading}
        />
      )}
    </Container>
  )
}

const mapState = ({ loading }: AppState) => ({
  loading,
})

export default connect(mapState, {
  dismissModal,
})(ModalControls)
