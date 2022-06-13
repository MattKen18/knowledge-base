import React, { useState, useEffect } from 'react';
import './Entry.css';
import $, { map } from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used



const Entry = (props) => {
  const [userTags, setUserTags] = useState([])
  const [id, setId] = useState(props.entryDetails.id)
  const [tag, setTag] = useState(props.entryDetails.tag)
  const [content, setContent] = useState(props.entryDetails.content)
  const [answer, setAnswer] = useState(props.entryDetails.answer)

  useEffect(() => {
    document.getElementById(`tag-marker${id + props.entryKey}`).style.backgroundColor = tag.color;
    getTags();
  }, [])

  // when the prop changes i.e. filtering tags, then update the state
  useEffect(() => {
    if (props.entryDetails.id != id) {
      setId(props.entryDetails.id)
      setTag(props.entryDetails.tag)
      setContent(props.entryDetails.content)
      setAnswer(props.entryDetails.answer)
    }
  }, [props])


  const getCookie = (name) => {
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

  const getTags = () => {
    const url = `http://127.0.0.1:8000/api/Tags/`;
    const csrftoken = getCookie('csrftoken');

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
        setUserTags(data);
      })

  }

  useEffect(() => {
    document.getElementById(`tag-marker${id + props.entryKey}`).style.backgroundColor = tag.color;
  }, [tag])

  const showAnswer = () => {
    const bt = document.getElementById(`answer-btn${id + props.entryKey}`);
    const answerText = document.getElementById(`answer-text${id + props.entryKey}`);

    bt.innerText = bt.innerText === "See Answer" ? "Hide Answer" : "See Answer";

    if (answerText.style.display === "" || answerText.style.display === "none") {
      answerText.style.display = "flex";
    } else {
      answerText.style.display = "none";
    }
  }


  const toggleEditPane = () => {
    const updatePaneId = `entry-form-holder${id + props.entryKey}`;
    const editTextOption = document.getElementById(`edit-option${id + props.entryKey}`);
    const confirmText = document.getElementById(`confirm-text-holder${id + props.entryKey}`);

    $(`#${updatePaneId}`).slideToggle();

    if (confirmText.style.display === "block") {
      $(`#confirm-text-holder${id + props.entryKey}`).slideToggle("1000", "swing");
    }

    if (editTextOption.style.color === "red") {
      editTextOption.style.color = "black";

    } else {
      editTextOption.style.color = "red";

    }

  }

  const updateEntry = (e) => {
    e.preventDefault();

    const updatePaneId = `entry-form-holder${id + props.entryKey}`;

    var url = `http://127.0.0.1:8000/api/updateEntry/${id}/`;

    const csrftoken = getCookie('csrftoken');
    const entryTag = JSON.parse(document.getElementById(`userTag${id + props.entryKey}`).value);
    const entryContent = document.getElementById(`content${id + props.entryKey}`).value;
    const entryAnswer = document.getElementById(`answer${id + props.entryKey}`).value;

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
        setTag(data.tag)
        setContent(data.content)
        setAnswer(data.answer)
      })
    toggleEditPane();

  }

  const deleteEntry = () => {
    const confirmText = document.getElementById(`confirm-text-holder${id + props.entryKey}`);
    const url = `http://127.0.0.1:8000/api/deleteEntry/${id}/`;
    const csrftoken = getCookie('csrftoken');

    if (confirmText.style.display == 'block') {
      fetch(url, {
        method: "DELETE",
        header: {
          "Content-type": "application/json",
          "X-CSRFToken": csrftoken
        },
      }).then(response => response.json())
        .then(data => {
          window.location.reload();
        })
    }

    $(`#confirm-text-holder${id + props.entryKey}`).slideToggle("1000", "swing");

  }


  return (
    <div className="entry-holder">
      <div className="entry-element">
        <div id={`tag-marker${id + props.entryKey}`} className="entry-element-tag-marker">
        </div>
        <div className="entry-element-content-holder">
          <div className="edit-option-holder">
            <p id={`edit-option${id + props.entryKey}`} className="edit-option grow grow-small" onClick={() => toggleEditPane()}><FontAwesomeIcon icon={solid('pen-to-square')} className="edit-entry-icon" /></p>
          </div>
          <div className="entry-content-holder text-holder">
            <p className="entry-content">{content}</p>
          </div>
          <div className="entry-content-holder answer-holder">
            <button id={`answer-btn${id + props.entryKey}`} className="answer-btn" onClick={() => showAnswer()}>See Answer</button>
            <p id={`answer-text${id + props.entryKey}`} className="answer-text">{answer}</p>
          </div>
        </div>
      </div>
      <div id={`entry-form-holder${id + props.entryKey}`} className="entry-form-holder">
        <form id={`entry-form${id + props.entryKey}`} className="entry-form" autoComplete='off'>
          <select id={`userTag${id + props.entryKey}`} className="form-control form-elem tag-selector-field">
            {userTags.map((i, k) => {
              if (i.id == tag.id) {
                return <option value={JSON.stringify(i)} key={k} selected>{i.name}</option>
              }
              return <option value={JSON.stringify(i)} key={k}>{i.name}</option>
            })}
          </select>
          <div key={content}>
            <textarea className="form-control form-elem content-field" type="text" name="content"
              id={`content${id + props.entryKey}`} defaultValue={content} maxLength="250" required></textarea>
          </div>
          <div key={answer}>
            <textarea className="form-control form-elem answer-field" type="text" name="answer"
              id={`answer${id + props.entryKey}`} defaultValue={answer} maxLength="250" required />
          </div>
          <div className="update-delete-btn-holder">
            <button id={`form-submit-btn${id + props.entryKey}`} className="btn update-entry-btn site-btn" type="submit" onClick={(e) => updateEntry(e)}>Save</button>
            <FontAwesomeIcon icon={solid("trash")} id={`delete-entry-icon${id + props.entryKey}`} className="delete-entry-icon grow-small" onClick={deleteEntry} />
            <div id={`confirm-text-holder${id + props.entryKey}`} className="confirm-text-holder">
              <p className="confirm-text"><FontAwesomeIcon icon={solid("arrow-left")} /> Click again to confirm</p>
            </div>
          </div>
        </form>
      </div >
    </div >

  );
}

export default Entry;