import $ from 'jquery';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Create.css';


const Create = () => {
  const [userTags, setUserTags] = useState([])
  const [selectedTag, setSelectedTag] = useState(null)


  useEffect(() => {
    fetchTags();
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
    })
      .then(response => response.json())
      .then(data => {
        setUserTags(data);
      })

  }

  const createEntry = (e) => {
    e.preventDefault();

    const url = `http://127.0.0.1:8000/api/createEntry/`;
    const csrftoken = getCookie('csrftoken');

    let entryTag = JSON.parse(document.getElementById("entry-tag").value);
    let entryContent = document.getElementById("entry-content").value;
    let entryAnswer = document.getElementById("entry-answer").value;

    fetch(url, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ tag: entryTag, content: entryContent, answer: entryAnswer })
    })
      .then(response => response.json())
      .then(data => {
        window.location.replace("/");
        // document.getElementById("goHome").click();
      })

  }

  const createTag = (e) => {
    e.preventDefault();

    const url = `http://127.0.0.1:8000/api/createTag/`;
    const csrftoken = getCookie('csrftoken');

    const tagName = document.getElementById("tag-name").value;
    const tagColor = document.getElementById("tag-color").value;

    if (!tagName) {
      return;
    }

    fetch(url, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ name: tagName, color: tagColor })
    }).then(response => response.json())
      .then(data => {
        toggleCreateTag();
        fetchTags();
        setSelectedTag(data);
      })

  }


  const toggleCreateTag = () => {
    const tagForm = document.getElementById("create-tag-form");
    const tagInput = document.getElementById("entry-tag");

    if (tagForm.style.display == '' || tagForm.style.display == "none") {
      tagInput.disabled = true;
    } else {
      tagInput.disabled = false;
    }

    $(`#${"create-tag-form"}`).slideToggle();
  }

  return (
    <div>
      <h1 className="site-heading entry-page-heading">Entry Builder</h1>
      <hr />
      <br />
      <div id="create-entry-form-holder" className="content-holder">
        <form id="create-entry-form" className="form-horizontal">
          <div id="inner-entry-form">
            <div className="form-group form-element-holder">
              <label for="entry-tag">Tag</label>
              <select id="entry-tag" className='form-control entry-detail-field'>
                {
                  userTags.map((i, k) => {
                    if (selectedTag) {
                      if (selectedTag.name == i.name) {
                        return (
                          <option value={JSON.stringify(i)} selected>{i.name}</option>
                        )
                      }
                    } else {
                      return (
                        <option value={JSON.stringify(i)}>{i.name}</option>
                      )
                    }
                  })
                }
              </select>
              <br></br>
              <button type="button" className="btn site-btn" onClick={toggleCreateTag}>Create New Tag</button>
              <div id="create-tag-form-holder">
                <br></br>
                <form id="create-tag-form" className="form-horizontal">
                  <div id="inner-tag-form">
                    <div className="form-group form-element-holder">
                      <label for="tag-name">Tag Name</label>
                      <input id="tag-name" className="form-control tag-name-field" placeholder='Enter new tag name' required />
                      <br></br>
                      <label for="tag-color">Tag Color</label>
                      <input id="tag-color" className="form-control tag-color-field" type="color" />
                    </div>
                    <br></br>
                    <button type="submit" id="create-tag-btn" className="btn site-btn" onClick={createTag}>Create Tag</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="form-group form-element-holder">
              <label for="entry-content">Entry Content</label>
              <textarea id="entry-content" className="form-control entry-detail-field" />
            </div>
            <div className="form-group form-element-holder">
              <label for="entry-answer">Entry Answer</label>
              <textarea id="entry-answer" className="form-control entry-detail-field" />
            </div>
            <Link to="/" id="goHome"></Link>
            <button type="submit" className="btn site-btn" onClick={createEntry}>Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Create;