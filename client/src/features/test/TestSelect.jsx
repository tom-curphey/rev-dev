import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';

export default class TestSelect extends Component {
  state = {
    options: [],
    value: {
      label: 'Please select a name',
      value: 'no-name-selected'
    }
  };

  componentDidMount() {
    let options = [
      { label: 'Tom', value: 'tom' },
      { label: 'Kalindi', value: 'kalindi' },
      { label: 'Carl', value: 'carl' }
    ];

    this.setState({ options: options });
  }

  handleChange = (newValue, actionMeta) => {
    if (newValue) {
      console.log('Handle Change: ', newValue);
      this.setState({ value: newValue });
    }
  };

  handleChangeValueButton = () => {
    this.setState({
      value: { label: 'Carl', value: 'carl' }
    });
  };

  render() {
    const { options, value } = this.state;
    return (
      <div>
        <h1>Test Select</h1>
        <div style={{ width: '400px', marginLeft: '20px' }}>
          <CreatableSelect
            isClearable
            onChange={this.handleChange}
            value={value}
            options={options}
          />
        </div>
        <button onClick={this.handleChangeValueButton}>
          Change Selected Value
        </button>
      </div>
    );
  }
}
