import React, { useState, useEffect, useContext, useRef } from 'react';
import './Home.css';
import Entry from '../Entry/Entry';
import { Link } from 'react-router-dom';
// import AuthContext from '../../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used


let domainName = 'http://127.0.0.1:8000';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userTags: [],
      entries: [],
      filtering: false,
      activeTags: [],
    };

    this.getCookie = this.getCookie.bind(this);
    this.fetchEntries = this.fetchEntries.bind(this);
    this.fetchTags = this.fetchTags.bind(this);
    this.filterEntries = this.filterEntries.bind(this);
    this.clearFilter = this.clearFilter.bind(this)
    this.showTagColorOnHover = this.showTagColorOnHover.bind(this);
    this.hideTagColorOnExitHover = this.hideTagColorOnExitHover.bind(this);
    this.setTagColorOnClick = this.setTagColorOnClick.bind(this);
  }


  componentDidMount() {
    this.fetchEntries();
    this.fetchTags();
    if (localStorage.getItem('token') !== null) {
      console.log("User is logged in");
    } else {
      console.log("User is not logged in");
    }
  }

  componentDidUpdate() {
    // console.log("entries to be rerendered: ", this.state.entries)
    // console.log("updated");
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

  fetchEntries() {
    const filterBtn = document.getElementById("filter-btn");

    fetch(`${domainName}/api/Entries/`)
      .then(response => response.json())
      .then(data => {
        this.setState((state) => {
          return { entries: data, filtering: false }
        }, () => {
          if (filterBtn.disabled == false) {
            filterBtn.disabled = true;
          } else {
            filterBtn = false;
          }
        })
        // this.setState({
        //   entries: data
        // })
      })

  }

  fetchTags() {
    const url = `http://127.0.0.1:8000/api/Tags/`;
    const csrftoken = this.getCookie('csrftoken');

    fetch(url, {
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify()
    })
      .then(response => response.json())
      .then(data => {
        this.setState(state => {
          return { userTags: data }
        })
      })

  }

  filterEntries(tagId) {
    const url = `http://127.0.0.1:8000/api/Entries/Filter-Entries/${tagId}`;
    const csrftoken = this.getCookie('csrftoken');

    const filterBtn = document.getElementById("filter-btn");
    filterBtn.disabled = false;

    // if (this.state.activeTags) {
    //   this.state.activeTags[0].style.borderLeftWidth = "0";
    // }
    fetch(url, {
      method: "GET",
      headers: {
        'COntent-type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify()
    })
      .then(response => response.json())
      .then(data => {
        this.setState(state => {
          return { entries: data, filtering: true }
        })
      })

  }

  clearFilter() {
    this.fetchEntries();
    if (this.state.activeTags) {
      this.state.activeTags[0].style.borderLeftWidth = "0";
      this.state.activeTags[0].classList.remove("active-tag");
      this.setState(state => {
        return { activeTags: [] }
      })
    }
  }

  showTagColorOnHover(e) {

    e.target.style.borderLeftWidth = '7px';
    e.target.style.borderLeftColor = `${this.state.userTags[parseInt(e.target.id.split('_')[1])].color}`;
    // e.target.style.cursor = 'pointer';
  }

  hideTagColorOnExitHover(e) {
    if (e.target.className !== "user-tag-selector active-tag") {
      e.target.style.borderLeftWidth = '0';
    }

    // if (!this.state.filtering) {
    //   e.target.style.borderLeftWidth = '0';
    // }
  }

  setTagColorOnClick(e) {
    this.setState(state => {
      return {
        activeTags: [...state.activeTags, e.target]
      }
    }, () => {
      e.target.className += " active-tag";
      if (this.state.activeTags.length > 1) {
        this.state.activeTags[0].style.borderLeftWidth = "0";
        this.state.activeTags[0].classList.remove("active-tag");
        this.setState(state => {
          return { activeTags: state.activeTags.slice(1) }
        })
      }
      e.target.style.borderLeftWidth = "7px";
      e.target.style.borderLeftColor = `${this.state.userTags[parseInt(e.target.id.split('_')[1])].color}`;
    })


  }

  render() {
    // let { name } = useContext(AuthContext);

    return (
      <div>
        {/* <h1 className="site-heading">Your Entries</h1>
        <hr />
        <br />
        <br /> */}
        {/* <button>Show Answers</button> */}
        <div id="main-site-holder">
          {/* <h3>Hello {name} </h3> */}
          <div className="site-section left-section">
            <h3 className="site-heading">Tags</h3>
            <hr />
            <br />
            <button onClick={this.clearFilter} id="filter-btn" className="btn site-btn clear-filter-btn">Clear filter</button> <br></br>
            <br />
            <ul>
              {this.state.userTags.map((i, k) => {
                return <li id={`tag-selector-element_${k}`} key={k} className="user-tag-selector" onClick={(e) => { this.filterEntries(i.id); this.setTagColorOnClick(e); }
                } onMouseEnter={(e) => this.showTagColorOnHover(e)} onMouseLeave={(e) => this.hideTagColorOnExitHover(e)}>{i.name}</li>
              })}
            </ul>
          </div>
          <div className="site-section right-section">
            <div className='site-heading-holder'>
              <h1 className="site-heading">
                Your Entries
              </h1>
            </div>
            <hr></hr>
            <br></br>
            <div id="entries-holder" className="content-holder">
              <Link
                to={{
                  pathname: "/Create"
                }}
                id="create-new-entry-btn"
                className="btn site-btn"

              >Add <FontAwesomeIcon icon={solid('plus')} /></Link>
              <ul>
                {this.state.entries.map((entry, k) => {
                  // console.log("entry to be rendered: ", entry.content);
                  return (
                    <li key={k}><Entry entryDetails={entry} entryKey={k} /></li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;