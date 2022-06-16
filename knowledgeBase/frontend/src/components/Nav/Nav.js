import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used


const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand site-logo" href="/"><FontAwesomeIcon icon={solid('book-open')} id="site-logo-icon" /> Knowledge<span id="logo-sec">Base</span></a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav link-list">
          <li className="nav-item active" key={0}>
            <a className="nav-link" href="/">Entries <span className="sr-only">(current)</span></a>
          </li>
          <li className="nav-item" key={1}>
            <a className="nav-link" href="/ManageTags">Manage Tags</a>
          </li>
          <li key={2}>
            <div id="search-bar-holder">
              <form className="form-inline site-search" id="search-bar">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn site-btn search-btn" type="submit">Search</button>
              </form>
            </div>
          </li>
          <li className="nav-item" key={3}>
            <a className="nav-link" href="/Login">Login</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav;