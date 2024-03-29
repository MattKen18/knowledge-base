import React from "react";
import "./ManageTags.css";
import Tag from "../Tag/Tag";
import $ from "jquery";
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

class ManageTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      deleting: false,
    }
    this.getCookie = this.getCookie.bind(this);
    this.fetchTags = this.fetchTags.bind(this);
    this.showHideCreateTagPane = this.showHideCreateTagPane.bind(this);
    this.createTag = this.createTag.bind(this);
    this.toggleDeleteTags = this.toggleDeleteTags.bind(this);
  }

  componentDidMount() {
    this.fetchTags();
    console.log(this.state.tags);

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
          return { tags: data }
        })
      })

  }

  showHideCreateTagPane() {
    const createTagPane = document.getElementById("create-tag-form-holder");
    console.log(document.getElementById(`create-tag-form`).style.display);
    $(`#create-tag-form`).slideToggle();

  }

  createTag(e) {
    e.preventDefault();
    const url = `http://127.0.0.1:8000/api/createTag/`;
    const csrftoken = this.getCookie('csrftoken');
    const tName = document.getElementById("tag-name").value;
    const tColor = document.getElementById("tag-color").value;

    if (!tName) {
      return;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ name: tName, color: tColor })
    }).then(response => response.json())
      .then(data => {
        this.setState(state => {
          return { tags: [] }
        }, () => this.fetchTags())
        this.showHideCreateTagPane();
        document.getElementById("create-tag-form").reset();
      })
  }

  toggleDeleteTags() {
    const deleteTagsIcon = document.getElementById("delete-tags-toggle-icon");
    const deleteTagBtn = document.getElementById("delete-tag-btn");
    const tagElements = document.getElementsByClassName("tag-grid-element-holder");
    const createTagPane = document.getElementById("create-tag-form");

    $("#delete-tag-warning-message").slideToggle();
    deleteTagBtn.disabled = deleteTagBtn.disabled ? false : true;
    console.log(createTagPane.style.display);

    if (createTagPane.style.display == "block") {
      $("#create-tag-form").slideUp();
    }
    this.setState(state => {
      return { deleting: state.deleting ? false : true }
    }, () => {
      if (this.state.deleting) {
        for (let tag of tagElements) {
          tag.style.animationName = "deleting";
        }
      } else {
        for (let tag of tagElements) {
          tag.style.animationName = "";
        }
      }

    })
    if (deleteTagsIcon.style.opacity == "0.7" || deleteTagsIcon.style.opacity == "") {
      deleteTagsIcon.style.opacity = "1";
    } else {
      deleteTagsIcon.style.opacity = "0.7";
    }

  }

  render() {
    return (
      <div>
        <div className="site-section">
          <h1 className="site-heading">Manage Tags</h1>
          <hr />
          <br />
          <div className="content-holder">
            <div id="add-delete-options-holder">
              <button id="delete-tag-btn" className="btn create-tag-pane-btn site-btn" onClick={this.showHideCreateTagPane}>Add <FontAwesomeIcon icon={solid('plus')} /></button>
              <FontAwesomeIcon icon={solid("trash")} id="delete-tags-toggle-icon" className="delete-tag-icon" onClick={this.toggleDeleteTags} />
            </div>
            <br></br>
            <p id="delete-tag-warning-message">Double click on tag to delete. <span>Warning!</span> all related entries will also be permanently deleted.</p>
            <div id="create-tag-form-holder">
              <br></br>
              <form id="create-tag-form" className="form-horizontal">
                <div id="inner-tag-form">
                  <div className="form-group form-element-holder">
                    <label htmlFor="tag-name">Tag Name</label>
                    <input id="tag-name" className="form-control tag-name-field" placeholder='Enter new tag name' required />
                    <br></br>
                    <label htmlFor="tag-color">Tag Color</label>
                    <input id="tag-color" className="form-control tag-color-field" type="color" />
                  </div>
                  <br></br>
                  <button type="submit" id="create-tag-btn" className="btn site-btn" onClick={this.createTag}>Create Tag</button>
                </div>
              </form>
              <br></br>
            </div>
            <div id="tags-holder">
              {this.state.tags.map((tag, k) => {
                return (
                  <div className="tag-grid-element-holder">{<Tag tagDetails={tag} deleting={this.state.deleting} tagKey={k} />}</div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

}


export default ManageTags;