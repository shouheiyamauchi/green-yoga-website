import React, { Component } from 'react';
import Auth from '../../modules/Auth';

class HomePage extends Component {
  componentDidMount() {
    // update authenticated state on logout
    this.props.toggleAuthenticateStatus()
  }

  render() {
    return (
      <div>
        <div className="section"></div>
        <h4>Welcome to Green Yoga</h4>
        <h6 className="quote">“Speak the Satya, follow the Dharma, from Svadhyaya never cease.”</h6>
        <h6 className="quote">-Taittiriya Upanishad, 1.11.1-2</h6>
        <div className="section"></div>
        <div className="section"></div>
        <div className="floated"></div>
        <div className="center-align">
          <img className="profile circle" src="/images/profile.jpg" />
        </div>
        <br />
        Green moved to Sydney in 2013 to settle down with her partner. She was struggling to adjust to her new environment and went through a period of depression. During this time she was neglecting her health, became overweight, and was having issues with her relationships. She decided that she needs to make a change and was searching for something she can enjoy. This is when she remembered that at one point she really enjoyed practicing yoga.<br /><br />
        She started to take classes at a local yoga studio and instantly fell in love with the Vinyasa yoga practice. As Green used to be an urban dancer during her high school years and currently practices breakdance, she interprets Vinyasa yoga not just as an exercise but also as a creative flow of movement. <br /><br />
        Green believes yoga has the power to change people's lives as she personally experienced dramatic improvement on her health and relationships as a result of her practice. She also practices meditation and breathing techniques every day and is very passionate to learn more about philosophy and the human body. <br /><br />
        Green’s teaching style is very energetic and focusing on each students’ body alignment. She loves to do hands-on assists to guide students to experience a deeper connection with their body.<br /><br />
        Green completed the 200 hours teacher training course in February 2017 and has since completed additional teacher training courses which were the “Art of Alignment and Assists” and “Practical Teaching Skills” with Bodymindlife.
        <div className="section"></div>
        <div className="section"></div>
        <div className="container">
          <div className="card">
            <div className="section"></div>
            <h4>Contact Me</h4>
            <div className="container">
              <div className="row">
                <form className="col s12">
                  <div className="row">
                    <div className="input-field col s12 m6 l6">
                      <input id="name" type="text" />
                      <label for="name">Name</label>
                    </div>
                    <div className="input-field col s12 m6 l6">
                      <input id="email" type="text" />
                      <label for="email">Email</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m12 l12">
                      <textarea id="textarea1" className="materialize-textarea"></textarea>
                      <label for="textarea1">Message</label>
                    </div>
                  </div>
                  <div className="button-line center-align">
                    <button className="btn waves-effect waves-light" type="submit" name="action">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="center-align footer-icon">
              <i className="fa fa-facebook-square" aria-hidden="true"></i>&nbsp;&nbsp;<i className="fa fa-instagram" aria-hidden="true"></i>
            </div>
            <div className="section"></div>

          </div>
          
        </div>
      </div>
    )
  }
};

export default HomePage;
