import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useDispatch } from 'react-redux'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import ModalContent from '../ModalContent'
import { initiatePrint } from '../../../store/printing/actions'
import { PrintableFormats, PrintingOptions } from '../../../store/printing/types'

export interface PrintOfferingModalData {
  offeringId: string;
}
interface OwnProps {
  modalData: PrintOfferingModalData;
}

const PrintOffering = ({
  modalData,
}: OwnProps) => {
  const dispatch = useDispatch()
  const [format, setFormat] = useState<PrintableFormats>('seating-chart')
  const [options, setOptions] = useState<PrintingOptions>({
    aisOnly: true,
    namesOnReverse: false,
    allSeatsBlank: false,
  })

  function handleConfirm() {
    dispatch(initiatePrint(format, options))
  }

  return (
    <>
      <ModalHeader title="Create Prints" />

      <ModalContent>
        <>
          <h4>Choose Format</h4>
          <ul>
            <li>
              <label htmlFor="seating-chart">
                <input
                  type="radio"
                  name="format"
                  id="seating-chart"
                  value="seating-chart"
                  checked={format === 'seating-chart'}
                  onChange={() => setFormat('seating-chart')}
                />
                Seating Chart
              </label>
            </li>
            <li>
              <label htmlFor="flash-cards">
                <input
                  type="radio"
                  name="format"
                  id="flash-cards"
                  value="flash-cards"
                  checked={format === 'flash-cards'}
                  onChange={() => setFormat('flash-cards')}
                />
                Flash Cards (Avery Template #5388)
              </label>
            </li>
            <li>
              <label htmlFor="name-tents">
                <input
                  type="radio"
                  name="format"
                  id="name-tents"
                  value="name-tents"
                  checked={format === 'name-tents'}
                  onChange={() => setFormat('name-tents')}
                />
                Name Tents (Avery Template #5309)
              </label>
            </li>
            <li>
              <label htmlFor="roster">
                <input
                  type="radio"
                  name="format"
                  id="roster"
                  value="roster"
                  checked={format === 'roster'}
                  onChange={() => setFormat('roster')}
                />
                Roster
              </label>
            </li>
          </ul>

          <div>
            <h4>OPTIONS</h4>
            <CSSTransition
              mountOnEnter
              in={format === 'seating-chart'}
              timeout={{
                enter: 300,
                exit: 0,
              }}
              classNames="slide-up-fade"
              unmountOnExit
            >
              <label htmlFor="all-seats-blank">
                <input
                  type="checkbox"
                  id="all-seats-blank"
                  name="all-seats-blank"
                  checked={options.allSeatsBlank}
                  onChange={() => setOptions(options => ({
                    ...options,
                    allSeatsBlank: !options.allSeatsBlank,
                  }))}
                />
                Print all seats empty
              </label>
            </CSSTransition>
            <CSSTransition
              mountOnEnter
              in={format === 'flash-cards'}
              timeout={{
                enter: 300,
                exit: 0,
              }}
              classNames="slide-up-fade"
              unmountOnExit
            >
              <label htmlFor="flash-card-reverse">
                <input
                  type="checkbox"
                  id="flash-card-reverse"
                  name="flash-card-reverse"
                  checked={options.namesOnReverse}
                  onChange={() => setOptions(options => ({
                    ...options,
                    namesOnReverse: !options.namesOnReverse,
                  }))}
                />
                Print names on reverse side
              </label>
            </CSSTransition>
            <CSSTransition
              mountOnEnter
              in={format === 'roster'}
              timeout={{
                enter: 300,
                exit: 0,
              }}
              classNames="slide-up-fade"
              unmountOnExit
            >
              <ul>
                <li>
                  <label htmlFor="ais-only">
                    <input
                      type="radio"
                      name="roster-ais-only"
                      id="ais-only"
                      checked={options.aisOnly}
                      onChange={() => setOptions(options => ({
                        ...options,
                        aisOnly: true,
                      }))}
                    />
                      Only students actively enrolled through AIS
                  </label>
                </li>
                <li>
                  <label htmlFor="all-students">
                    <input
                      type="radio"
                      name="roster-ais-only"
                      id="all-students"
                      checked={!options.aisOnly}
                      onChange={() => setOptions(options => ({
                        ...options,
                        aisOnly: false,
                      }))}
                    />
                      AIS enrolled plus manually added students
                  </label>
                </li>
              </ul>
            </CSSTransition>
          </div>
        </>
      </ModalContent>

      <ModalControls
        confirmText="Save"
        handleConfirm={handleConfirm}
      />
    </>
  )
}

export default PrintOffering
