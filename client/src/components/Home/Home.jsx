import React from "react";
import css from "./Home.module.scss";
import rideSvg from "../../images/ride3.png";
import * as bi from "react-icons/bi";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className={`${css.container}`}>
      <div className={css.top}>
        <div className={css.left}>
          <bi.BiMenuAltLeft />
        </div>
        <NavLink to="/signup">
        <div className={css.right}>Next</div>
        </NavLink>
      </div>
      <div className={css.header}>
        <img src={rideSvg} alt="" />
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#4789FC" fill-opacity="1" d="M0,192L120,208C240,224,480,256,720,234.7C960,213,1200,139,1320,101.3L1440,64L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path></svg> */}
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#4789FC" fill-opacity="2" d="M0,32L120,53.3C240,75,480,117,720,117.3C960,117,1200,75,1320,53.3L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path></svg> */}
      </div>
      <div className={css.contentwrap}>
        <div className={css.content}>
          <h3>Together</h3>
          <h3>We Travel</h3>
          <span>Share ride, save money and reduce the cost of fuel.</span>
        </div>
        <div className={css.line}></div>
        <div className={`flexBetween ${css.buttonWrap}`}>
          <NavLink to="/signup">
            <button className={css.signup}>Get Started</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;
