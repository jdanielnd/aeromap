import React from 'react';

export default function Heading(props) {
  return (
    <svg height="45" width="45" viewBox={`0 0 1000 1000`}>
      <polygon points="500,150 250,750 750,750" className="triangle" transform={"rotate(" + props.heading + ", 500, 500)"} />
      Sorry, your browser does not support inline SVG.
    </svg>
  );
}
