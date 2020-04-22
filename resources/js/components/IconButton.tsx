import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core'
import styled from '../utils/styledComponents'
import { theme } from '../utils/theme'

interface StyledButtonProps {
  iconSize: number;
  iconColor: string;
  iconHoverColor: string;
  backgroundHoverColor: string;
  boxShadow: boolean;
}

const Button = styled('button')<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  width: 4em;
  height: 4em;
  border-radius: 100%;
  transition: background-color 150ms ease-out;
  svg {
    font-size: ${props => props.theme.ms(props.iconSize)};
    margin: auto;
    color: ${props => props.iconColor};
    transition: color 150ms ease-out;
  }
  &:hover {
    svg {
      color: ${props => props.iconHoverColor};
    }
    background: ${props => props.backgroundHoverColor};
  }
`

interface OwnProps {
  icon: [IconPrefix, IconName];
  handler: () => void;
  fixedWidth?: boolean;
  iconSize?: number;
  iconColor?: string;
  iconHoverColor?: string;
  backgroundHoverColor?: string;
  boxShadow?: boolean;
}

const IconButton = ({
  icon,
  handler,
  fixedWidth = false,
  iconSize = 1,
  iconColor = theme.black,
  iconHoverColor = theme.red,
  backgroundHoverColor = theme.lightGray,
  boxShadow = true,
}: OwnProps) => (
  <Button
    className="icon-button"
    onClick={handler}
    iconSize={iconSize}
    iconColor={iconColor}
    iconHoverColor={iconHoverColor}
    backgroundHoverColor={backgroundHoverColor}
    boxShadow={boxShadow}
  >
    <FontAwesomeIcon icon={icon} fixedWidth={fixedWidth} />
  </Button>
)

export default IconButton
