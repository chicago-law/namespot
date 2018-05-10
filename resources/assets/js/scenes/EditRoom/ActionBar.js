import React from 'react';
import ActionBarEditRoom from './containers/ActionBarEditRoom';
// import EditSection from '../../containers/actionbar/EditSection';

const ActionBar = ({match}) => (
  <div className='action-bar-container'>
    <ActionBarEditRoom roomID={match.params.id}/>
    {/* <EditSection /> */}
  </div>
)

export default ActionBar