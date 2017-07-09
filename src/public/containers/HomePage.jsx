import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import ContactForm from './ContactForm.jsx';
import Gallery from './Gallery.jsx';

class HomePage extends Component {
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
        <Gallery />
        <div className="section"></div>
        <div className="section"></div>
        <ContactForm />
      </div>
    )
  }
};

export default HomePage;
