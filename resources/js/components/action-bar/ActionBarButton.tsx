import React, { ReactNode } from 'react'
import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../../utils/styledComponents'

const Button = styled('button')`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1em;
  height: 100%;
  transition: background 150ms ease-out;
  .picture {
    margin-bottom: 0.25em;
    img, svg {
      max-height: 3.5em;
    }
  }
  .svg-inline--fa {
    font-size: ${(props) => props.theme.ms(2)};
    color: ${(props) => props.theme.black};
    opacity: 0.75;
    margin-bottom: 0.5em;
    transition: color 150ms ease-out;
  }
  .button-text {
    display: block;
    font-size: ${(props) => props.theme.ms(-1)};
    margin: 0;
    text-transform: capitalize;
  }
  &.active {
    background: ${(props) => props.theme.lightGray};
    color: ${(props) => props.theme.red};
  }
  &:hover {
    background: ${(props) => props.theme.lightGray};
    svg {
      color: ${(props) => props.theme.red};
    }
  }
`

interface OwnProps {
  text: string | ReactNode;
  handler: Function;
  isActive?: boolean;
  icon?: [IconPrefix, IconName];
  image?: string;
}

const ActionBarButton = ({
  text,
  handler,
  isActive = false,
  icon,
  image,
}: OwnProps) => (
  <Button type="button" className={isActive ? 'active' : ''} onClick={(e) => handler(e)}>
    <div className="picture">
      {icon && (
        <FontAwesomeIcon icon={icon} />
      )}
      {image && (
        <img src={image} alt="" />
      )}
    </div>
    <span className="button-text">{text}</span>
  </Button>
)

export default ActionBarButton
