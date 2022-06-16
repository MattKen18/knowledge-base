import React, { useState, useEffect } from "react";
import "./Tag.css";
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used


const Tag = (props) => {
  const [tagName, setTagName] = useState(props.tagDetails.name)
  const [tagColor, setTagColor] = useState(props.tagDetails.color)

  useEffect(() => {
    fillTagColor();
  }, [tagColor])

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

  useEffect(() => {
    if (!props.deleting) {
      const delTags = document.getElementsByClassName("del-clicked");
      if (delTags.length > 0) {
        delTags[0].classList.remove("del-clicked");
      }
    }
  }, [props.deleting])

  const fillTagColor = () => {
    const tag = document.getElementById(`tag-element-color${props.tagKey}`);
    tag.style.backgroundColor = tagColor;
  }

  const deleteTag = () => {
    const url = `http://127.0.0.1:8000/api/deleteTag/${props.tagDetails.id}/`;
    const csrftoken = getCookie('csrftoken');

    fetch(url, {
      method: "DELETE",
      header: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    })

  }


  const onTagClick = () => {
    if (!props.deleting) {
      const tag = document.getElementById(`tag-element-color${props.tagKey}`)
      tag.style.transform = "scale(1.15)";
      $(`#update-tag-form${props.tagKey}`).slideDown("fast");
    } else {
      const tagElem = document.getElementById(`tag-element-color${props.tagKey}`);
      const clickedElems = document.getElementsByClassName("del-clicked");//prev clicked elems 
      if (clickedElems.length > 0) {
        if (tagElem == clickedElems[0]) {
          deleteTag();
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

  const onTagHover = () => {
    const updateForm = document.getElementById(`update-tag-form${props.tagKey}`);
    $(`#update-tag-form${props.tagKey}`).slideToggle("fast");

  }

  const onTagExitHover = () => {
    const updateForm = document.getElementById(`update-tag-form${props.tagKey}`);
    updateForm.reset();
    const tag = document.getElementById(`tag-element-color${props.tagKey}`)
    tag.style.transform = "scale(1)";
    $(`#update-tag-form${props.tagKey}`).slideUp("fast");
  }

  const updateTag = (e) => {
    e.preventDefault();

    const url = `http://127.0.0.1:8000/api/updateTag/${props.tagDetails.id}/`;
    const csrftoken = getCookie('csrftoken');

    const tName = document.getElementById(`tag-grid-name${props.tagKey}`).value;
    const tColor = document.getElementById(`tag-grid-color${props.tagKey}`).value;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ name: tName, color: tColor })
    }).then(response => response.json())
      .then(data => {
        setTagName(data.name);
        setTagColor(data.color);
      })
  }

  return (
    <div id={`tag-element-color${props.tagKey}`} className="tag-grid-element" onClick={onTagClick} onMouseLeave={onTagExitHover}>
      <div className="tag-element-holder">
        <p className="tag-element-name">{tagName}</p>
        <div className="tag-grid-form-holder">
          <form id={`update-tag-form${props.tagKey}`} className="tag-grid-form">
            <div className="form-group">
              <input id={`tag-grid-name${props.tagKey}`} className="form-control tag-grid-name-field" required autoComplete="off" defaultValue={tagName} />
              <div className="color-save-btn-holder">
                <input id={`tag-grid-color${props.tagKey}`} className="form-control tag-grid-color-field" type="color" defaultValue={tagColor} />
                <div className="tick-icon-holder"><FontAwesomeIcon icon={solid("circle-check")} onClick={updateTag} /></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Tag;