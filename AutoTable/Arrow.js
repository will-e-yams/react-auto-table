import React from "react"
import PropTypes from "prop-types"

Arrow.propTypes = {
  direction: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
}

export default function Arrow(props) {
  return (
    <i
      className={`fas fa-long-arrow-alt-${props.direction}`}
      style={props.active ? { color: "#002855" } : { color: "#999" }}
    />
  )
}
