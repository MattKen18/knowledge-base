import React from "react";
import "./Login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: false,
      loading: true,
    }

    this.getCookie = this.getCookie.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  };

  componentDidMount() {
    // if (localStorage.getItem('token') !== null) {
    //   window.location.replace('http://localhost:3000/');
    // } else {
    //   this.setState({ loading: false });
    // }
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  updateEmail(e) {
    this.setState({ email: e.target.value });
  }

  updatePassword(e) {
    this.setState({ password: e.target.value });
  }


  onSubmit(e) {
    e.preventDefault();
    const url = 'http://127.0.0.1:8000/api/v1/users/auth/login/';
    const csrftoken = this.getCookie("csrftoken");
    const user = {
      email: "testEmail3@gmail.com",//this.state.email,
      password: "Test12345",//this.state.password
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(user)
    }).then(response => response.json())
      .then(data => {
        console.log(data.name);
        console.log("email:", this.state.email, "password", this.state.password)
        if (data.key) {
          localStorage.clear();
          localStorage.setItem('token', data.key);
          console.log(data.key)
          window.location.replace('http://localhost:3000/');
        } else {
          this.setState({
            email: '',
            password: '',
            errors: true
          })
          localStorage.clear();
        }
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label htmlFor='email'>Email address:</label> <br />
          <input
            name='email'
            type='email'
            value={this.state.email}
            required
            onChange={e => this.updateEmail(e)}
          />{' '}
          <br />
          <label htmlFor='password'>Password:</label> <br />
          <input
            name='password'
            type='password'
            value={this.state.password}
            required
            onChange={e => this.updatePassword(e)}
          />{' '}
          <br />
          <input type='submit' value='Login' />
        </form>
      </div>
    )
  }


}

export default Login;