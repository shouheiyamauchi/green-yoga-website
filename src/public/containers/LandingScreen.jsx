import React, { Component } from 'react';
import Slider from 'react-slick';

class LandingScreen extends Component {
  constructor(props) {
    super(props);
    this.startTimeout = this.startTimeout.bind(this);
    this.setFullPageStyle = this.setFullPageStyle.bind(this);
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

  setFullPageStyle(image) {
    const fullPageStyle = {
      height: "calc(100vh - 64px)",
      width: "100%",
      backgroundImage: `url(${image})`,
      backgroundRepeat: "no-repeat",
      backgroundPositionX: "center",
      backgroundPositionY: "center",
      WebkitBackgroundSize: "cover",
      MozBackgroundSize: "cover",
      OBackgroundSize: "cover",
      backgroundSize: "cover",
      position: "relative"
    }
    return fullPageStyle
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
          <div style={this.setFullPageStyle('/images/front-page/1.jpg')}>
          </div>
        </div>
        <div>
          <div style={this.setFullPageStyle('/images/front-page/2.jpg')}>
          </div>
        </div>
      </Slider>
    );
  }
}

export default LandingScreen;
