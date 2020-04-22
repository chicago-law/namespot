// These are more-or-less arbitrary numbers that decide how we're going to
// slice and dice the room up. This is what a Table's coordinates are in
// relation too, so you can't change this unless you want to mess up all
// existing tables. Okay, not completely arbitrary - they're about the right
// granularity for the making tables and they divide up kinda nicely for
// the guides we need to lay on top.

const gridDimensions = {
  rows: 40,
  columns: 78,
}

export default gridDimensions
