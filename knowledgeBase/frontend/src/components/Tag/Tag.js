import React from "react";
import "./Tag.css";
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: this.props.tagDetails.name,
      tagColor: this.props.tagDetails.color,
      // clicks: 0, //keep track of how many times user clicks tag for delete functionality
    }

    this.getCookie = this.getCookie.bind(this);
    this.setTagColor = this.setTagColor.bind(this);
    this.updateTag = this.updateTag.bind(this);
    this.onTagClick = this.onTagClick.bind(this);
    this.onTagHover = this.onTagHover.bind(this);
    this.onTagExitHover = this.onTagExitHover.bind(this);
  }

  componentDidMount() {
    this.setTagColor();
  }

  componentDidUpdate() {
    this.setTagColor();
    console.log(this.props.deleting);
    if (!this.props.deleting) {
      const delTags = document.getElementsByClassName("del-clicked");
      if (delTags.length > 0) {
        delTags[0].classList.remove("del-clicked");
      }
    }
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


  setTagColor() {
    const tag = document.getElementById(`tag-element-color${this.props.tagKey}`);
    tag.style.backgroundColor = this.state.tagColor;
  }

  deleteTag() {
    const url = `http://127.0.0.1:8000/api/deleteTag/${this.props.tagDetails.id}/`;
    const csrftoken = this.getCookie('csrftoken');

    fetch(url, {
      method: "DELETE",
      header: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState(state => {
          return { clicks: 0 }
        })
      })
  }

  onTagClick() {
    if (!this.props.deleting) {
      const tag = document.getElementById(`tag-element-color${this.props.tagKey}`)
      tag.style.transform = "scale(1.15)";
      $(`#update-tag-form${this.props.tagKey}`).slideDown("fast");
    } else {
      const tagElem = document.getElementById(`tag-element-color${this.props.tagKey}`);
      const clickedElems = document.getElementsByClassName("del-clicked")//prev clicked elems 
      if (clickedElems.length > 0) {
        if (tagElem == clickedElems[0]) {
          this.deleteTag();
          window.location.reload();
        } else {
          clickedElems[0].classList.remove("del-clicked");
          tagElem.classList.add("del-clicked");
        }
      } else {
        tagElem.classList.add("del-clicked");
      }
    }


  }

  onTagHover() {
    const updateForm = document.getElementById(`update-tag-form${this.props.tagKey}`);
    $(`#update-tag-form${this.props.tagKey}`).slideToggle("fast");


  }

  onTagExitHover() {
    const updateForm = document.getElementById(`update-tag-form${this.props.tagKey}`);
    updateForm.reset();
    const tag = document.getElementById(`tag-element-color${this.props.tagKey}`)
    tag.style.transform = "scale(1)";
    $(`#update-tag-form${this.props.tagKey}`).slideUp("fast");
  }

  updateTag(e) {
    e.preventDefault();
    const url = `http://127.0.0.1:8000/api/updateTag/${this.props.tagDetails.id}/`;
    const csrftoken = this.getCookie('csrftoken');

    const tName = document.getElementById(`tag-grid-name${this.props.tagKey}`).value;
    const tColor = document.getElementById(`tag-grid-color${this.props.tagKey}`).value;
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
          return { tagName: tName, tagColor: tColor }
        })
      })
  }

  render() {
    return (
      <div id={`tag-element-color${this.props.tagKey}`} className="tag-grid-element" onClick={this.onTagClick} onMouseLeave={this.onTagExitHover}>
        <div className="tag-element-holder">
          <p className="tag-element-name">{this.state.tagName}</p>
          <div className="tag-grid-form-holder">
            <form id={`update-tag-form${this.props.tagKey}`} className="tag-grid-form">
              <div className="form-group">
                <input id={`tag-grid-name${this.props.tagKey}`} className="form-control tag-grid-name-field" required autoComplete="off" defaultValue={this.state.tagName} />
                <div className="color-save-btn-holder">
                  <input id={`tag-grid-color${this.props.tagKey}`} className="form-control tag-grid-color-field" type="color" defaultValue={this.state.tagColor} />
                  <div className="tick-icon-holder"><FontAwesomeIcon icon={solid("circle-check")} onClick={this.updateTag} /></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Tag;