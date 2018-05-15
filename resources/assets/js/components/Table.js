import React from 'react';

const Table = ({ coords, gridrowheight, gridcolumnwidth } ) => {
  let d = '';
  if (coords.qX) {
    d = `M${coords.sX * gridcolumnwidth} ${coords.sY * gridrowheight}
         Q${coords.qX * gridcolumnwidth} ${coords.qY * gridrowheight}
         ${coords.eX * gridcolumnwidth} ${coords.eY * gridrowheight}`;
  } else {
    d = `M${coords.sX * gridcolumnwidth} ${coords.sY * gridrowheight}
         L${coords.eX * gridcolumnwidth} ${coords.eY * gridrowheight}`;
  }

  return (
    <path d={d} stroke="#aaa" strokeWidth="10" fill="transparent" />
  )
}

export default Table;