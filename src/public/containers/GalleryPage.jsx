import React, { Component } from 'react';
import Gallery from './Gallery.jsx';

const images = [
  ['/images/gallery/thumb-1.jpg', '/images/gallery/1.jpg'],
  ['/images/gallery/thumb-2.jpg', '/images/gallery/2.jpg'],
  ['/images/gallery/thumb-3.jpg', '/images/gallery/3.jpg'],
  ['/images/gallery/thumb-4.jpg', '/images/gallery/4.jpg'],
  ['/images/gallery/thumb-5.jpg', '/images/gallery/5.jpg'],
  ['/images/gallery/thumb-6.jpg', '/images/gallery/6.jpg'],
  ['/images/gallery/thumb-7.jpg', '/images/gallery/7.jpg'],
  ['/images/gallery/thumb-8.jpg', '/images/gallery/8.jpg']
];

class GalleryPage extends Component {
  render() {
    return (
      <div>
        <div className="section"></div>
        <h4>Gallery</h4>
        <h6 className="quote">“The rhythm of the body, the melody of the mind & the harmony of the soul create the symphony of life.”</h6>
        <h6 className="quote">-B.K.S Iyengar</h6>
        <div className="section"></div>
        <Gallery images={images} />
      </div>
    )
  }
};

export default GalleryPage;
