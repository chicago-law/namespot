import React, { Component } from 'react';
import { rootUrl } from '../../../actions';
// import { html2canvas } from 'html2canvas';
// import * as jsPDF from 'jspdf';

export default class PrintRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'format':null,
      'ready-to-print':false
    }
  }

  onFormatChange(e) {
    this.setState({
      'format':e.target.value
    });
  }

  printButtonClick() {
    // this.props.history.push(`/print/seating-chart/${this.props.currentRoom.id}/${this.props.currentOffering.id}?size=letter`);
    this.props.setModal('print-room',false);
    // this.props.setView('print-seating-chart');
    // var doc = new jsPDF({
    //   orientation: 'landscape',
    //   unit: 'in',
    //   format: [4, 2]
    // })

    // doc.text('Hello world!', 1, 1)
    // doc.save('two-by-four.pdf')
  }

  render() {

    return (
      <div className='print-room'>

        <header>
          <h2><i className="far fa-print"></i>Print</h2>
        </header>

        <main>
          <p><strong>Choose Format</strong></p>
          <input type='radio' id='format-seating-chart' name='choose-format' value='seating-chart' onChange={(e) => this.onFormatChange(e)}/><label htmlFor='format-seating-chart'>Seating Chart</label><br/>
          <input type='radio' id='format-flash-cards' name='choose-format' value='flash-cards' onChange={(e) => this.onFormatChange(e)}/><label htmlFor='format-flash-cards'>Flash Cards</label><br/>
          <input type='radio' id='format-name-tents' name='choose-format' value='name-tents' onChange={(e) => this.onFormatChange(e)}/><label htmlFor='format-name-tents'>Name Tents</label>
        </main>

        <footer className="controls">
          <button className='btn-clear' onClick={() => this.props.close()}><small>Cancel</small></button>
          {/* <button className='btn-accent' onClick={() => this.printButtonClick()}>Print</button> */}
          <a href={`${rootUrl}print/seating-chart/${this.props.currentRoom.id}/${this.props.currentOffering.id}?size=letter`} target='_blank'>
            <button className='btn-accent' onClick={() => this.printButtonClick()}>Print</button>
          </a>
        </footer>

      </div>
    )
  }
}