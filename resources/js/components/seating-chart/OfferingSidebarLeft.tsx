import React, { useState } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RouteComponentProps } from 'react-router-dom'
import styled from '../../utils/styledComponents'
import animateEntrance from '../../utils/animateEntrance'
import { AppState } from '../../store'
import { Offering } from '../../store/offerings/types'
import { updateOffering } from '../../store/offerings/actions'

const Container = styled('div')`
  position: relative;
  ${animateEntrance('slideRight')};
  ul {
    margin: 0;
  }
  li {
    display: flex;
    align-items: center;
    margin-bottom: 2em;
    font-size: ${(props) => props.theme.ms(-1)};
    color: ${(props) => props.theme.middleGray};
    svg {
      margin-right: 0.5em;
      font-size: ${(props) => props.theme.ms(2)};
      @media (max-width: ${(props) => props.theme.break.medium}) {
        display: none;
      }
    }
    h5 {
      margin: 0 0 0.25em 0;
    }
  }
`

interface StoreProps {
  offering: Offering;
  updateOffering: typeof updateOffering;
}
interface RouteParams {
  offeringId: string;
}

const OfferingSidebarLeft = ({ offering, updateOffering }: StoreProps) => {
  const [paperSize, setPaperSize] = useState(offering.paper_size || 'tabloid')
  const [fontSize, setFontSize] = useState(offering.font_size || 'default')
  const [namesToShow, setNamesToShow] = useState(offering.names_to_show || 'first_and_last')
  const [useNicknames, setUseNicknames] = useState(offering.use_nicknames === null ? true : !!offering.use_nicknames)
  const [usePrefixes, setUsePrefixes] = useState(offering.use_prefixes === null ? false : !!offering.use_prefixes)
  const [flipPerspective, setFlipPerspective] = useState(offering.flipped === null ? false : !!offering.flipped)

  function handlePaperSize(size: string) {
    if (size === 'letter' || size === 'tabloid') {
      setPaperSize(size)
      updateOffering(offering.id, {
        paper_size: size,
      }, true)
    }
  }

  function handleFontSize(size: string) {
    if (size === 'default' || size === 'smaller' || size === 'larger' || size === 'x-large') {
      setFontSize(size)
      updateOffering(offering.id, {
        font_size: size,
      }, true)
    }
  }

  function handleNamesToShow(format: string) {
    if (format === 'first_and_last'
      || format === 'first_and_last_initial'
      || format === 'first_only'
      || format === 'last_only'
    ) {
      setNamesToShow(format)
      updateOffering(offering.id, {
        names_to_show: format,
      }, true)
    }
  }

  function handleUseNicknames(checked: boolean) {
    setUseNicknames(checked)
    updateOffering(offering.id, {
      use_nicknames: checked ? 1 : 0,
    }, true)
  }

  function handleUsePrefixes(checked: boolean) {
    setUsePrefixes(checked)
    updateOffering(offering.id, {
      use_prefixes: checked ? 1 : 0,
    }, true)
  }

  function handleFlipPerspective(checked: boolean) {
    setFlipPerspective(checked)
    updateOffering(offering.id, {
      flipped: checked ? 1 : 0,
    }, true)
  }

  return (
    <Container>
      <ul>
        <li>
          <FontAwesomeIcon icon={['far', 'file']} fixedWidth style={{ transform: 'rotate(90deg)' }} />
          <div>
            <h5>Paper Size</h5>
            <select value={paperSize} onChange={(e) => handlePaperSize(e.target.value)}>
              <option value="tabloid">11 x 17</option>
              <option value="letter">8.5 x 11</option>
            </select>
          </div>
        </li>
        <li>
          <FontAwesomeIcon icon={['far', 'text-size']} fixedWidth />
          <div>
            <h5>Name Size</h5>
            <select value={fontSize} onChange={(e) => handleFontSize(e.target.value)}>
              <option value="smaller">Smaller</option>
              <option value="default">Default</option>
              <option value="larger">Larger</option>
              <option value="x-large">Largest</option>
            </select>
          </div>
        </li>
        <li>
          <FontAwesomeIcon icon={['far', 'id-card']} fixedWidth />
          <div>
            <h5>Names To Show</h5>
            <select value={namesToShow} onChange={(e) => handleNamesToShow(e.target.value)}>
              <option value="first_and_last">First and Last</option>
              <option value="first_and_last_initial">First and Last Initial</option>
              <option value="first_only">First Only</option>
              <option value="last_only">Last Only</option>
            </select>
          </div>
        </li>
        <li>
          <FontAwesomeIcon icon={['far', 'user-edit']} fixedWidth />
          <div>
            <h5>
              <label htmlFor="use_nicknames">
                <input
                  id="use_nicknames"
                  type="checkbox"
                  checked={useNicknames}
                  onChange={(e) => handleUseNicknames(e.target.checked)}
                />
                Use Nicknames
              </label>
            </h5>
          </div>
        </li>
        <li>
          <FontAwesomeIcon icon={['far', 'user-tag']} fixedWidth />
          <div>
            <h5>
              <label htmlFor="use_prefixes">
                <input
                  id="use_prefixes"
                  type="checkbox"
                  checked={usePrefixes}
                  onChange={(e) => handleUsePrefixes(e.target.checked)}
                />
                Use Prefixes
              </label>
            </h5>
          </div>
        </li>
        <li>
          <FontAwesomeIcon icon={['far', 'sync']} fixedWidth />
          <div>
            <h5>
              <label htmlFor="flipped">
                <input
                  id="flipped"
                  type="checkbox"
                  checked={flipPerspective}
                  onChange={(e) => handleFlipPerspective(e.target.checked)}
                />
                Flip Perspective
              </label>
            </h5>
          </div>
        </li>
      </ul>
    </Container>
  )
}

const mapState = ({ offerings }: AppState, { match }: RouteComponentProps<RouteParams>) => ({
  offering: offerings[match.params.offeringId],
})

export default connect(mapState, {
  updateOffering,
})(OfferingSidebarLeft)
