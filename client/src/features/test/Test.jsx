import React, { Component } from 'react';
import axios from 'axios';

class Test extends Component {
  state = {
    items: [],
    item: { name: '' },
    idToBeDeleted: '',
    itemToUpdate: ''
  };

  // Fetch passwords after first mount
  componentDidMount() {
    this.getData()
      .then(data => {
        console.log('Test Data: ', data);
        this.setState({ items: data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Update To Database Called');
    console.log('PrevState', prevState);
    console.log('State', this.state);
    console.log('PrevProps', prevProps);

    // Typical usage (don't forget to compare props):
    if (
      this.state.item !== prevState.item ||
      this.state.idToBeDeleted !== prevState.idToBeDeleted ||
      this.state.itemToUpdate !== prevState.itemToUpdate
    ) {
      this.getData()
        .then(data => {
          console.log(data);
          this.setState({ items: data });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      return this.state;
    }
  }

  async getData() {
    console.log('Getting Data..');
    const res = await axios.get('/api/item');
    return await res.data; // (Or whatever)
  }

  async postData(data) {
    const res = await axios.post('/api/item', data);
    console.log('Sent Data..');
    return await res.data; // (Or whatever)
  }

  async deleteData(data) {
    console.log('ID: ', data.toString());
    try {
      const res = await axios.delete(`/api/item/${data}`);
      // const res = await axios.delete('/api/item/', data);
      // const res = await axios.delete('/api/item', { data: data });
      console.log('Deleting Data..');
      return await res.data; // (Or whatever)
    } catch (err) {
      console.log('Error Mesage:', err);
    }
  }

  async updateData(id, data) {
    console.log('ID: ', id);
    console.log('Data: ', data);
    try {
      const res = await axios.put(`/api/item/${id}`, data);
      console.log('Updating Data..');
      return await res.data; // (Or whatever)
    } catch (err) {
      console.log('Error Mesage:', err);
    }
  }

  // Why is this a binding function?
  async handleDelete(id) {
    // async deleteData(id)
    // console.log('idBefore: ', this.state.idToBeDeleted);
    await this.setState({ idToBeDeleted: id });
    // console.log('idToBeDeleted: ', this.state.idToBeDeleted);
    await this.deleteData(id);
    await this.setState({ idToBeDeleted: '' });
  }

  //
  //
  //
  //
  //
  //
  //

  handleSetUpdateState = id => {
    const itemToUpdate = this.state.items.filter(
      item => item._id === id
    );
    // It only returns one value so we can retrieve it with [0]
    // console.log(itemToUpdate[0]);
    this.setState({ itemToUpdate: itemToUpdate[0] });
  };

  handleUpdateChange = e => {
    const { itemToUpdate } = this.state;

    this.setState({
      itemToUpdate: {
        ...itemToUpdate,
        [e.target.name]: e.target.value
      }
    });
  };

  handleChange = e => {
    this.setState({ item: { [e.target.name]: e.target.value } });
  };

  handleSubmit = e => {
    e.preventDefault();
    // console.log(this.state);
    this.postData(this.state.item);
    this.setState({ item: { name: '' } });
  };

  handleUpdateSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    const { itemToUpdate } = this.state;
    console.log('Just before update: ', itemToUpdate);
    this.updateData(itemToUpdate._id, itemToUpdate);
    this.setState({ itemToUpdate: '' });
  };

  render() {
    const { items, item, itemToUpdate } = this.state;
    return (
      <section className="crud">
        <div>
          <h2>Crud Example</h2>
          <form method="POST">
            <label htmlFor="item">Item: </label>
            <input
              onChange={this.handleChange}
              type="text"
              name="name"
              value={item.name}
            />
            <button onClick={this.handleSubmit} type="submit">
              Submit
            </button>
          </form>
          <ul>
            {items &&
              items.map((item, i) => (
                <li key={i}>
                  <p
                    onClick={() =>
                      this.handleSetUpdateState(item._id)
                    }
                  >
                    {item.name}
                  </p>
                  <button
                    className="delete"
                    onClick={() => this.handleDelete(item._id)}
                  >
                    x
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div style={{ marginLeft: '20px' }}>
          {itemToUpdate && (
            <div>
              <h2>Update {itemToUpdate.name}</h2>
              <form method="PUT">
                <input
                  type="text"
                  name="name"
                  value={itemToUpdate.name}
                  onChange={this.handleUpdateChange}
                />
                <button
                  onClick={this.handleUpdateSubmit}
                  type="submit"
                >
                  Update Item
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default Test;
