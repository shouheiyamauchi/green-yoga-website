import React, { Component } from 'react';
import Slider from 'react-slick';

class LandingScreen extends Component {
  constructor(props) {
    super(props);
    this.startTimeout = this.startTimeout.bind(this);
    this.setFullPageStyle = this.setFullPageStyle.bind(this);
  };

  componentDidMount() {
    this.startTimeout();
  }

  startTimeout() {
    // If autoplay is working we reset timeout and it will never end up inside.
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // prevent function from firing on page change
      if (this.slider != null) {
        // This will start play again, important here is to have a timeout that exceeds your "autoplaySpeed".
        this.slider.innerSlider.play();
      }
    }, 2250);
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
      position: "relative",
    }
    return fullPageStyle
  }

  render() {
    var settings = {
      dots: false,
      infinite: true,
      speed: 2000,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      autoplay: true,
      autoplaySpeed: 2250,
      pauseOnHover: false,
      draggable: false
    };

    return (
      <Slider ref={c => this.slider = c } afterChange={ () => this.startTimeout() } beforeChange={ () => this.startTimeout() } {...settings} >
        <div>
          <div style={this.setFullPageStyle('/images/landing/1.jpg')} className="mobile-full-page-style">
            <div className="landing">
              <div className="title">Welcome to Green Yoga<br /></div>
              <div className="subtitle">
                “Speak the Satya, follow the Dharma, from Svadhyaya never cease.”<br />
                -Taittiriya Upanishad, 1.11.1-2
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={this.setFullPageStyle('/images/landing/2.jpg')} className="mobile-full-page-style">
            <div className="landing">
              <div className="title">Welcome to Green Yoga<br /></div>
              <div className="subtitle">
                “Loka Samasta Sukhino Bhavantu.”
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={this.setFullPageStyle('/images/landing/3.jpg')} className="mobile-full-page-style">
          <div className="landing">
            <div className="title">Welcome to Green Yoga<br /></div>
            <div className="subtitle">
              “Yoga is the stilling of the fluctuations of the mind.”<br />
              -Yoga Sutra 1.2
            </div>
          </div>
          </div>
        </div>
      </Slider>
    );
  }
}

export default LandingScreen;
