import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class LabelPosition extends Component {
  state = {
    selection: this.props.tempTable.labelPosition || 'below'
  }

  onSelectPosition(e) {
    this.setState({ selection: e.target.value })
  }

  onChoosePositionButton() {
    this.props.setLabelPosition(this.state.selection)
    this.props.setModal('label-position',false)
  }

  render() {
    return (
      <div>

        <header>
          <h2>Label Position</h2>
        </header>

        <main>
          <p><strong>Where should name labels display?</strong></p>
          <input type='radio' id='label-pos-below' name='label-pos-below' value='below' checked={this.state.selection === 'below'} onChange={(e) => this.onSelectPosition(e)} /><label htmlFor='label-pos-below'>Below (default)</label><br/>
          <input type='radio' id='label-pos-above' name='label-pos-above' value='above' checked={this.state.selection === 'above'} onChange={(e) => this.onSelectPosition(e)} /><label htmlFor='label-pos-above'>Above</label><br/>
          <input type='radio' id='label-pos-left' name='label-pos-left' value='left' checked={this.state.selection === 'left'} onChange={(e) => this.onSelectPosition(e)} /><label htmlFor='label-pos-left'>Left</label><br/>
          <input type='radio' id='label-pos-right' name='label-pos-right' value='right' checked={this.state.selection === 'right'} onChange={(e) => this.onSelectPosition(e)} /><label htmlFor='label-pos-right'>Right</label>
        </main>

        <footer className="controls">
          <button className='btn-clear' onClick={() => this.props.close()}>Cancel</button>
          <button className='btn-accent' onClick={() => this.onChoosePositionButton()}>Choose Position</button>
        </footer>

      </div>
    )
  }
}

LabelPosition.propTypes = {
  close: PropTypes.func.isRequired,
  setLabelPosition: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
  tempTable: PropTypes.object.isRequired
}