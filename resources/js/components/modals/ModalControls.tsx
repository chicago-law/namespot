import React from 'react'
import { useDispatch } from 'react-redux'
import styled from '../../utils/styledComponents'
import TextButton from '../TextButton'
import { dismissModal } from '../../store/modal/actions'
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

interface Props {
  confirmText?: string;
  handleConfirm?: () => void;
  confirmButtonType?: 'button' | 'submit';
  confirmDisabled?: boolean;
  showLoading?: boolean;
  cancelText?: string;
  handleCancel?: () => void;
  cancelButtonType?: 'button' | 'submit';
  deferDismissal?: boolean; // Tell the modal not to close itself
  cancelOnly?: boolean;
  returnKeyConfirms?: boolean;
}

const ModalControls = ({
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
}: Props) => {
  const dispatch = useDispatch()

  function onConfirm(e: React.MouseEvent | KeyboardEvent) {
    // We're assuming here that you don't want the click event of the modal
    // controls to bubble up to any listeners.
    e.stopPropagation()

    // If a confirm handler was passed in through props, fire that.
    if (handleConfirm) {
      // If you are deferring, we assume you will dispatch dismissModal from
      // inside handleConfirm (or wherever, I guess).
      // Otherwise, fire confirm as well as dismiss.
      if (deferDismissal) {
        handleConfirm()
      } else {
        dispatch(dismissModal())
        handleConfirm()
      }
    } else {
      // If there's no confirm handler, just close the modal.
      dispatch(dismissModal())
    }
  }

  function onCancel(e: React.MouseEvent | KeyboardEvent) {
    // We're assuming here that you don't want the click event of the modal
    // controls to bubble up to any listeners.
    e.stopPropagation()
    if (handleCancel) handleCancel()
    dispatch(dismissModal())
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
        clickHandler={e => onCancel(e)}
      />
      {!cancelOnly && (
        <TextButton
          type={confirmButtonType}
          text={confirmText}
          variant="red"
          clickHandler={e => onConfirm(e)}
          disabled={confirmDisabled}
          loading={showLoading}
        />
      )}
    </Container>
  )
}

export default ModalControls
