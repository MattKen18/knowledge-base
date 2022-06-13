import React, { useState, useEffect, useContext, useRef } from 'react';
import './Home.css';
import Entry from '../Entry/Entry';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used


let domainName = 'http://127.0.0.1:8000';

const Home = () => {
  const [userTags, setUserTags] = useState([])
  const [entries, setEntries] = useState([])
  const [filtering, setFiltering] = useState(false)
  const [activeTag, setActiveTag] = useState("")


  useEffect(() => {
    fetchEntries();
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

  const csrftoken = getCookie('csrftoken');

  const fetchEntries = () => {
    const filterBtn = document.getElementById("filter-btn");

    fetch(`${domainName}/api/Entries/`)
      .then(response => response.json())
      .then(data => {
        setEntries(data);
        setFiltering(false);
        filterBtn.disabled = filterBtn.disabled == false ? true : false;
        // if (filterBtn.disabled == false) {
        //   filterBtn.disabled = true;
        // } else {
        //   filterBtn = false;
        // }
      })
  }

  // const useFetchEntries = () => {
  //   const filterBtn = document.getElementById("filter-btn");

  //   useEffect(() => {
  //     fetch(`${domainName}/api/Entries/`)
  //       .then(response => response.json())
  //       .then(data => {
  //         // if (!didMount.current) {
  //         //   didMount.current = true;
  //         //   return;
  //         // }
  //         setEntries(data);
  //         setFiltering(false);

  //         if (filterBtn.disabled == false) {
  //           filterBtn.disabled = true;
  //         } else {
  //           filterBtn = false;
  //         }
  //       })
  //   }, [entries, filtering])
  // }


  const fetchTags = () => {
    const url = `http://127.0.0.1:8000/api/Tags/`;

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

  const filterEntries = (tagId) => {
    const url = `http://127.0.0.1:8000/api/Entries/Filter-Entries/${tagId}`;

    const filterBtn = document.getElementById("filter-btn");
    filterBtn.disabled = false;

    // if (this.state.activeTags) {
    //   this.state.activeTags[0].style.borderLeftWidth = "0";
    // }
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
        setEntries(data);
        setFiltering(true);
      })

  }

  const clearFilter = () => {
    fetchEntries();
    if (activeTag) {
      activeTag.style.borderLeftWidth = "0";
      activeTag.classList.remove("active-tag");
      setActiveTag("")
    }
  }

  const showTagColorOnHover = e => {

    e.target.style.borderLeftWidth = '7px';
    e.target.style.borderLeftColor = `${userTags[parseInt(e.target.id.split('_')[1])].color}`;
    // e.target.style.cursor = 'pointer';
  }

  const hideTagColorOnExitHover = e => {
    if (e.target !== activeTag) {
      e.target.style.borderLeftWidth = '0';
    }
    // if (e.target.className !== "user-tag-selector active-tag") {
    //   e.target.style.borderLeftWidth = '0';
    // }

    // if (!this.state.filtering) {
    //   e.target.style.borderLeftWidth = '0';
    // }
  }

  // const useSetTagColorOnClick = e => {
  //   if (!didMount.current) {
  //     didMount.current = true;
  //     return;
  //   }
  //   useEffect(() => {
  //     e.target.className += " active-tag";
  //     if (activeTags.length > 1) {
  //       activeTags[0].style.borderLeftWidth = "0";
  //       activeTags[0].classList.remove("active-tag");
  //       setActiveTags(activeTags.slice(1));
  //     }
  //     e.target.style.borderLeftWidth = "7px";
  //     e.target.style.borderLeftColor = `${this.state.userTags[parseInt(e.target.id.split('_')[1])].color}`;
  //   }, [activeTags])

  //   setActiveTags([...activeTags, e.target])
  // }

  // const setTagColorOnClick = e => {

  //   setActiveTags((prevState) => {
  //     return [...prevState, e.target]
  //   })

  //   e.target.className += " active-tag";

  //   if (activeTags.length > 1) {
  //     activeTags[0].style.borderLeftWidth = "0";
  //     activeTags[0].classList.remove("active-tag");
  //     setActiveTags(activeTags.slice(1));
  //   }

  //   e.target.style.borderLeftWidth = "7px";
  //   e.target.style.borderLeftColor = `${userTags[parseInt(e.target.id.split('_')[1])].color}`;

  //   // setActiveTags([...activeTags, e.target])
  // }


  const setTagColorOnClick = e => {

    if (e.target === activeTag) {
      return
    }

    setActiveTag(prevActiveTag => {

      if (prevActiveTag) {
        prevActiveTag.style.borderLeftWidth = "0";
      }

      return e.target
    });

    // remove color from the previous active tag
    // activeTag.style.borderLeftWidth = "0";
  }

  useEffect(() => {
    if (activeTag) {
      activeTag.style.borderLeftWidth = "7px";
      activeTag.style.borderLeftColor = `${userTags[parseInt(activeTag.id.split('_')[1])].color}`;
    }
  }, [activeTag])

  return (
    <div>
      <div id="main-site-holder">
        {/* <p id="prev-tag">Prev Tag: </p>
        <p id="active-tag">Active Tag: </p> */}
        <div className="site-section left-section">
          <h3 className="site-heading">Tags</h3>
          <hr />
          <br />
          <button onClick={clearFilter} id="filter-btn" className="btn site-btn clear-filter-btn">Clear filter</button> <br></br>
          <br />
          <ul>
            {userTags.map((i, k) => {
              return <li id={`tag-selector-element_${k}`} key={k} className="user-tag-selector" onClick={(e) => { filterEntries(i.id); setTagColorOnClick(e); }
              } onMouseEnter={(e) => showTagColorOnHover(e)} onMouseLeave={(e) => hideTagColorOnExitHover(e)}>{i.name}</li>
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
              {entries.map((entry, k) => {
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


export default Home;