// import React from 'react';
//
// const LandingScreen = () => {
//   return (
//     <div className="front-page">
//
//     </div>
//   )
// };
//
// export default LandingScreen;

import React, { Component } from 'react';
import Slider from 'react-slick';

class LandingScreen extends Component {
  constructor(props) {
    super(props);
    this.startTimeout = this.startTimeout.bind(this);
  };

  startTimeout() {
    // If autoplay is working we reset timeout and it will never end up inside.
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // prevent function from firing on page change
      if (this.slider != null) {
        // This will start play again, important here is to have a timeout that exceeds your "autoplaySpeed".
        this.slider.innerSlider.play();
      }
    }, 2500);
  }

  render() {
    var settings = {
      dots: false,
      infinite: true,
      speed: 1500,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      autoplay: true,
      autplaySpeed: 2000,
      pauseOnHover: false
    };

    return (
      <Slider ref={c => this.slider = c } afterChange={ () => this.startTimeout() } beforeChange={ () => this.startTimeout() } {...settings} >
        <div>
          <div className="front-page">
          </div>
        </div>
        <div>
          <div className="front-page2">
          </div>
        </div>
      </Slider>
    );
  }
}

export default LandingScreen;
