// @flow
import React from 'react'

type Props = {
  label: string,
}

function Checkbox(props: Props) {
  return (
    <label>
      <input type="checkbox" {...props} />
      <span>{props.label}</span>
    </label>
  )
}

export default Checkbox
