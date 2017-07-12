import React, { Component } from 'react';

class DatePickerField extends Component {
  constructor(props, context) {
    super(props, context);
    this._onChange = this._onChange.bind(this);
  }

  _onChange(e) {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange(e);
  }

  render() {
    return (
      <div>
        <input name="startDate" type="text" onClick={this.props.onClick} value={this.props.value} onChange={this._onChange} readOnly />
        <label className="date-picker-label active">{this.props.label}</label>
      </div>
    )
  }
};

export default DatePickerField;
