import React from 'react'
import styled from '../../utils/styledComponents'
import animateEntrance from '../../utils/animateEntrance'

const Container = styled('div')`
  position: relative;
  .message {
    background: ${props => props.theme.lightGray};
    border-left: 5px solid ${props => props.theme.blue};
    padding: 1em;
    ${animateEntrance('fadeSlideRight', 200, 50)};
    header {
      h4 {
        margin: 0.5em 0 1em 0;
        font-weight: bold;
        color: ${props => props.theme.darkGray};
      }
    }
    p {
      font-size: ${props => props.theme.ms(0)};
      font-style: italic;
      opacity: 0.75;
    }
  }
`

interface OwnProps {
  image?: React.ReactNode;
  heading: string;
  text: string[];
}

const SidebarToolTip = ({
  image,
  heading,
  text,
}: OwnProps) => (
  <Container>
    <div className="message">
      <header>
        {image && <>{image}</>}
        <h4>{heading}</h4>
      </header>
      {text.map(t => (
        <p key={t}>{t}</p>
      ))}
    </div>
  </Container>
)

export default SidebarToolTip
