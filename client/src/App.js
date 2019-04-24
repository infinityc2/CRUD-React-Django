import React, { Component } from 'react';
import './assets/css/App.css';
import Modal from './components/Modal';
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemList: [],
      modal: false,
      activeItem: {
        name: "",
        description: ""
      },
    }
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("http://localhost:8000/api/items/")
      .then(res => this.setState({ itemList: res.data }))
      .catch(err => console.log(err));
  };

  // Toggle Modal Component
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  createItem = () => {
    const item = { name: "", description: "" };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/items/${item.id}`)
      .then(res => this.refreshList());
  };

  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/items/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/items/", item)
      .then(res => this.refreshList());
  };

  renderItems = () => {
    return this.state.itemList.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>
          {item.name}: {item.description}
        </span>
        <span>
          <button className="btn btn-secondary mr-2" onClick={() => this.editItem(item)}>Edit</button>
          <button className="btn btn-danger" onClick={() => this.handleDelete(item)}>Delete</button>
        </span>
      </li>))
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-secondary">
          <span>CRUD</span>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="https://reactjs.org/">React</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://www.djangoproject.com/">Django</a>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="container bg-dark">
          <main className="content">
            <h1 className="text-white text-uppercase text-center my-4">Manage Item</h1>
            <div className="row ">
              <div className="col-md-6 col-sm-10 mx-auto p-0">
                <div className="card p-3">
                  <div className="">
                    <button className="btn btn-primary" onClick={this.createItem}>Add task</button>
                  </div>
                  <ul className="list-group list-group-flush">
                    {this.renderItems()}
                  </ul>
                </div>
              </div>
            </div>
            {this.state.modal ? (
              <Modal
                activeItem={this.state.activeItem}
                toggle={this.toggle}
                onSave={this.handleSubmit}
              />
            ) : null}
          </main>
        </div>
      </div>
    );
  }
}

export default App;
