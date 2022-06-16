import React, { useEffect, useState } from "react";
import "./ManageTags.css";
import Tag from "../Tag/Tag";
import $ from "jquery";
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used



const ManageTags = () => {
  const [tags, setTags] = useState([])
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

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

  const fetchTags = () => {
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
        setTags(data)
      })

  }

  const showHideCreateTagPane = () => {
    const createTagPane = document.getElementById("create-tag-form-holder");
    console.log(document.getElementById(`create-tag-form`).style.display);
    $(`#create-tag-form`).slideToggle();

  }

  const createTag = (e) => {
    e.preventDefault();

    const url = `http://127.0.0.1:8000/api/createTag/`;
    const csrftoken = getCookie('csrftoken');
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
        setTags([]);
        fetchTags();
        showHideCreateTagPane();
        document.getElementById("create-tag-form").reset();
      })
  }

  const toggleDeleteTags = () => {
    const deleteTagsIcon = document.getElementById("delete-tags-toggle-icon");
    const deleteTagBtn = document.getElementById("delete-tag-btn");
    const createTagPane = document.getElementById("create-tag-form");

    $("#delete-tag-warning-message").slideToggle();
    deleteTagBtn.disabled = deleteTagBtn.disabled ? false : true;
    // console.log(createTagPane.style.display);

    if (createTagPane.style.display == "block") {
      $("#create-tag-form").slideUp();
    }

    setDeleting((prevDeleting) => {
      return prevDeleting ? false : true
    })

    if (deleteTagsIcon.style.opacity == "0.7" || deleteTagsIcon.style.opacity == "") {
      deleteTagsIcon.style.opacity = "1";
    } else {
      deleteTagsIcon.style.opacity = "0.7";
    }

  }

  useEffect(() => {
    const tagElements = document.getElementsByClassName("tag-grid-element-holder");
    if (deleting) {
      for (let tag of tagElements) {
        tag.style.animationName = "deleting";
      }
    } else {
      for (let tag of tagElements) {
        tag.style.animationName = "";
        console.log("remove animation");
      }
    }
  }, [deleting])

  return (
    <div>
      <div className="site-section">
        <h1 className="site-heading">Manage Tags</h1>
        <hr />
        <br />
        <div className="content-holder">
          <div id="add-delete-options-holder">
            <button id="delete-tag-btn" className="btn create-tag-pane-btn site-btn" onClick={showHideCreateTagPane}>Add <FontAwesomeIcon icon={solid('plus')} /></button>
            <FontAwesomeIcon icon={solid("trash")} id="delete-tags-toggle-icon" className="delete-tag-icon" onClick={toggleDeleteTags} />
          </div>
          <br></br>
          <p id="delete-tag-warning-message">Double click on tag to delete. <span>Warning!</span> all related entries will also be permanently deleted.</p>
          <div id="create-tag-form-holder">
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
                <button type="submit" id="create-tag-btn" className="btn site-btn" onClick={createTag}>Create Tag</button>
              </div>
            </form>
          </div>
          <div id="tags-holder">
            {tags.map((tag, k) => {
              return (
                <div className="tag-grid-element-holder" key={k}>{<Tag tagDetails={tag} deleting={deleting} tagKey={k} />}</div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ManageTags;