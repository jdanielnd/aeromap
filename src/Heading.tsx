import React from 'react';
import { Component } from 'react';

type HeadingState = {
  heading: number
}

type HeadingProps = {
  heading: number
}

export class Heading extends Component<HeadingProps, HeadingState> {
  constructor(props: HeadingProps) {
    super(props)
    this.state = props
  }
  render() {
    return (
      <svg height="45" width="45" viewBox={`0 0 1000 1000`}>
        <polygon points="500,150 250,750 750,750" className="triangle" transform={"rotate(" + this.state.heading + ", 500, 500)"} />
        Sorry, your browser does not support inline SVG.
      </svg>
    )
  } 
}
