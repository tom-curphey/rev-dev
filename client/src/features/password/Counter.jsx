import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    console.log('Constructor');

    super(props);
    this.state = {
      counter: 0
    };
    this.increment = () =>
      this.setState({ counter: this.state.counter + 1 });
    this.decrement = () =>
      this.setState({ counter: this.state.counter - 1 });
  }

  // this is called right after render
  // componentDidMount() {
  //   console.log('Component Did Mount');
  //   console.log('-------------------');
  // }

  render() {
    console.log('Render');

    return (
      <div style={{ margin: '50px' }}>
        <button onClick={this.decrement}>Decrement</button>
        <button onClick={this.increment}>Increment</button>
        <br />
        Counter: {this.state.counter}
      </div>
    );
  }
}
export default Counter;
