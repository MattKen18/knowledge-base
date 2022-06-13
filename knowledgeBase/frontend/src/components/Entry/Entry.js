import React from 'react';
import './Entry.css';
import $, { map } from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

class Entry extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userTags: [],
      id: this.props.entryDetails.id,
      tag: this.props.entryDetails.tag,
      content: this.props.entryDetails.content,
      answer: this.props.entryDetails.answer,
    };

    this.getCookie = this.getCookie.bind(this);
    this.showAnswer = this.showAnswer.bind(this);
    this.toggleEditPane = this.toggleEditPane.bind(this);
    this.updateEntry = this.updateEntry.bind(this);
    this.getTags = this.getTags.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
  }

  componentDidMount() {
    document.getElementById(`tag-marker${this.state.id + this.props.entryKey}`).style.backgroundColor = this.state.tag.color;
    this.getTags();
  }

  // enables the component to update the state if the prop changes i.e., when I filter the entries.
  static getDerivedStateFromProps(nextProps, prevState) {

    if (nextProps.entryDetails.id != prevState.id) {
      return {
        id: nextProps.entryDetails.id,
        tag: nextProps.entryDetails.tag,
        content: nextProps.entryDetails.content,
        answer: nextProps.entryDetails.answer
      }
    } else {
      return null;
    }

    // if (
    //   props.entryDetails.tag !== state.tag ||
    //   props.entryDetails.content !== state.content ||
    //   props.entryDetails.answer !== state.answer
    // ) {
    //   return {
    //     tag: props.entryDetails.tag,
    //     content: props.entryDetails.content,
    //     answer: props.entryDetails.answer
    //   };
    // }
    // return null;
  }

  // UNSAFE_componentWillReceiveProps(props) {
  //   this.setState({
  //     tag: props.entryDetails.tag,
  //     content: props.entryDetails.content,
  //     answer: props.entryDetails.answer,
  //   })
  // }

  componentDidUpdate() {
    document.getElementById(`tag-marker${this.state.id + this.props.entryKey}`).style.backgroundColor = this.state.tag.color;
    // console.log("state from entry component:", this.state);

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

  showAnswer() {
    const bt = document.getElementById(`answer-btn${this.state.id + this.props.entryKey}`);
    const answerText = document.getElementById(`answer-text${this.state.id + this.props.entryKey}`);

    if (bt.innerText === "See Answer") {
      bt.innerText = "Hide Answer";
    } else {
      bt.innerText = "See Answer";
    }

    if (answerText.style.display === "" || answerText.style.display === "none") {
      answerText.style.display = "flex";
    } else {
      answerText.style.display = "none";
    }

    // answerText.style.borderLeft = `5px solid ${this.state.tag.color}`;
  }

  toggleEditPane() {
    const updatePaneId = `entry-form-holder${this.state.id + this.props.entryKey}`;
    const editTextOption = document.getElementById(`edit-option${this.state.id + this.props.entryKey}`);
    const confirmText = document.getElementById(`confirm-text-holder${this.state.id + this.props.entryKey}`);
    $(`#${updatePaneId}`).slideToggle();

    if (confirmText.style.display === "block") {
      $(`#confirm-text-holder${this.state.id + this.props.entryKey}`).slideToggle("1000", "swing");
    }
    // $(`#confirm-text-holder${this.state.id + this.props.entryKey}`).slideToggle("1000", "swing");

    // if (document.getElementById(updatePaneId).style.display !== '' ) {
    //   const submitBtn = document.getElementById(`form-submit-btn${this.state.id + this.props.entryKey}`);
    //   submitBtn.disabled = true;      
    // }

    if (editTextOption.style.color === "red") {
      editTextOption.style.color = "black";

    } else {
      editTextOption.style.color = "red";

    }

  }

  updateEntry(e) {
    // console.log('updateEntry clicked');
    e.preventDefault();

    const updatePaneId = `entry-form-holder${this.state.id + this.props.entryKey}`;

    var url = `http://127.0.0.1:8000/api/updateEntry/${this.state.id}/`;

    const csrftoken = this.getCookie('csrftoken');
    const entryTag = JSON.parse(document.getElementById(`userTag${this.state.id + this.props.entryKey}`).value);
    const entryContent = document.getElementById(`content${this.state.id + this.props.entryKey}`).value;
    const entryAnswer = document.getElementById(`answer${this.state.id + this.props.entryKey}`).value;

    // console.log(JSON.stringify({ tag: entryTag, content: entryContent, answer: entryAnswer }));// console.log("Entry Tag:", entryTag);

    fetch(url, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ tag: entryTag, content: entryContent, answer: entryAnswer })
    })
      .then((response) => response.json())
      .then(data => {
        this.setState(state => {
          // console.log(data.tag);
          return { tag: data.tag, content: data.content, answer: data.answer }
        })//, () => console.log("new tag name:", data.tag.name))
      })
    this.toggleEditPane();

  }

  getTags() {
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
        }, () => console.log())
      })

  }

  deleteEntry() {
    const confirmText = document.getElementById(`confirm-text-holder${this.state.id + this.props.entryKey}`);
    const url = `http://127.0.0.1:8000/api/deleteEntry/${this.state.id}/`;
    const csrftoken = this.getCookie('csrftoken');

    if (confirmText.style.display == 'block') {
      fetch(url, {
        method: "DELETE",
        header: {
          "Content-type": "application/json",
          "X-CSRFToken": csrftoken
        },
      }).then(response => response.json())
        .then(data => {
          console.log(data);
          window.location.reload();
        })
    }

    $(`#confirm-text-holder${this.state.id + this.props.entryKey}`).slideToggle("1000", "swing");

  }

  render() {

    return (
      <div className="entry-holder">
        <div className="entry-element">
          <div id={`tag-marker${this.state.id + this.props.entryKey}`} className="entry-element-tag-marker">
          </div>
          <div className="entry-element-content-holder">
            <div className="edit-option-holder">
              <p id={`edit-option${this.state.id + this.props.entryKey}`} className="edit-option grow grow-small" onClick={() => this.toggleEditPane()}><FontAwesomeIcon icon={solid('pen-to-square')} className="edit-entry-icon" /></p>
            </div>
            <div className="entry-content-holder text-holder">
              <p className="entry-content">{this.state.content}</p>
            </div>
            <div className="entry-content-holder answer-holder">
              <button id={`answer-btn${this.state.id + this.props.entryKey}`} className="answer-btn" onClick={() => this.showAnswer()}>See Answer</button>
              <p id={`answer-text${this.state.id + this.props.entryKey}`} className="answer-text">{this.state.answer}</p>
            </div>
          </div>
        </div>
        <div id={`entry-form-holder${this.state.id + this.props.entryKey}`} className="entry-form-holder">
          <form id={`entry-form${this.state.id + this.props.entryKey}`} className="entry-form" autoComplete='off'>
            <select id={`userTag${this.state.id + this.props.entryKey}`} className="form-control form-elem tag-selector-field">
              {this.state.userTags.map((i, k) => {
                if (i.id == this.state.tag.id) {
                  return <option value={JSON.stringify(i)} key={k} selected>{i.name}</option>
                }
                return <option value={JSON.stringify(i)} key={k}>{i.name}</option>
              })}
            </select>
            {/* <p>{this.state.content}</p> */}
            <div key={this.state.content}>
              <textarea className="form-control form-elem content-field" type="text" name="content"
                id={`content${this.state.id + this.props.entryKey}`} defaultValue={this.state.content} maxLength="250" onInput={this.enableButton} required></textarea>
            </div>
            <div key={this.state.answer}>
              <textarea className="form-control form-elem answer-field" type="text" name="answer"
                id={`answer${this.state.id + this.props.entryKey}`} defaultValue={this.state.answer} maxLength="250" onInput={this.enableButton} required />
            </div>
            <div className="update-delete-btn-holder">
              <button id={`form-submit-btn${this.state.id + this.props.entryKey}`} className="btn update-entry-btn site-btn" type="submit" onClick={this.updateEntry}>Save</button>
              <FontAwesomeIcon icon={solid("trash")} id={`delete-entry-icon${this.state.id + this.props.entryKey}`} className="delete-entry-icon grow-small" onClick={this.deleteEntry} />
              <div id={`confirm-text-holder${this.state.id + this.props.entryKey}`} className="confirm-text-holder">
                <p className="confirm-text"><FontAwesomeIcon icon={solid("arrow-left")} /> Click again to confirm</p>
              </div>
            </div>
          </form>
        </div >
      </div >

    );
  }
}

export default Entry;