import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="row mt-5">
    <div className="col-sm-2 col-md-3 col-lg-4 col-xl-5"></div>
    <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-1 d-grid">
      <Link to="/broadcast" className="btn btn-lg btn-danger">
        <i className="fas fa-video"></i>
        <div>Broadcast</div>
      </Link>
    </div>
    <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-1 d-grid">
      <Link to="/dashboard" className="btn btn-lg btn-primary">
        <i className="fas fa-th"></i>
        <div>Dashboard</div>
      </Link>
    </div>
    <div className="col-sm-2 col-md-3 col-lg-4 col-xl-5"></div>
  </div>
);

export default Home;
