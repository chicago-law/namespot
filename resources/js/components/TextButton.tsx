import React from 'react'
import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../utils/styledComponents'
import Loading from './Loading'

const Container = styled('button')<{ isLoading: boolean }>`
  position: relative;
  display: inline-block;
  padding: 0.8em 1.5em;
  font-weight: bold;
  border-radius: 5px;
  font-size: ${props => props.theme.ms(-1)};
  .content {
    opacity: ${props => (props.isLoading ? '0' : '1')};
  }
  .loading {
    display: ${props => (props.isLoading ? 'block' : 'none')};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    svg {
      color: white;
    }
  }
  &.red {
    color: white;
    background: ${props => props.theme.red};
    transition: opacity 100ms ease-out, background 100ms ease-out;
    &:hover {
      opacity: 0.75;
    }
  }
  &.clear {
    color: ${props => props.theme.black};
    &:hover {
      color: ${props => props.theme.red};
      background: ${props => props.theme.lightGray};
    }
  }
  &:disabled {
    color: white !important;
    background: ${props => props.theme.middleGray} !important;
    opacity: 1 !important;
  }
`

interface OwnProps {
  text: string;
  variant: 'clear' | 'red';
  clickHandler: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit';
  leftIcon?: [IconPrefix, IconName];
  rightIcon?: [IconPrefix, IconName];
  disabled?: boolean;
  style?: React.CSSProperties;
  loading?: boolean;
}

const TextButton = ({
  text,
  variant,
  clickHandler,
  type = 'button',
  leftIcon,
  rightIcon,
  disabled = false,
  style = {},
  loading = false,
}: OwnProps) => {
  function handleClick(e: React.MouseEvent) {
    clickHandler(e)
  }

  return (
    <Container
      type={type}
      onClick={handleClick}
      className={`text-button ${variant}`}
      disabled={disabled}
      style={style}
      isLoading={loading}
    >
      <div className="content">
        {leftIcon && (
          <FontAwesomeIcon icon={leftIcon} style={{ marginRight: '1em' }} />
        )}
        {text}
        {rightIcon && (
          <FontAwesomeIcon icon={rightIcon} style={{ marginLeft: '1em' }} />
        )}
      </div>
      <div className="loading">
        <Loading />
      </div>
    </Container>
  )
}

export default TextButton
