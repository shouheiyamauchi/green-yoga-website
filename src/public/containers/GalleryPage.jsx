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
  ['/images/gallery/thumb-8.jpg', '/images/gallery/8.jpg'],
  ['/images/gallery/thumb-9.jpg', '/images/gallery/9.jpg'],
  ['/images/gallery/thumb-10.jpg', '/images/gallery/10.jpg'],
  ['/images/gallery/thumb-11.jpg', '/images/gallery/11.jpg'],
  ['/images/gallery/thumb-12.jpg', '/images/gallery/12.jpg'],
  ['/images/gallery/thumb-13.jpg', '/images/gallery/13.jpg'],
  ['/images/gallery/thumb-14.jpg', '/images/gallery/14.jpg'],
  ['/images/gallery/thumb-15.jpg', '/images/gallery/15.jpg'],
  ['/images/gallery/thumb-16.jpg', '/images/gallery/16.jpg'],
  ['/images/gallery/thumb-17.jpg', '/images/gallery/17.jpg'],
  ['/images/gallery/thumb-18.jpg', '/images/gallery/18.jpg'],
  ['/images/gallery/thumb-19.jpg', '/images/gallery/19.jpg'],
  ['/images/gallery/thumb-20.jpg', '/images/gallery/20.jpg'],
  ['/images/gallery/thumb-21.jpg', '/images/gallery/21.jpg'],
  ['/images/gallery/thumb-22.jpg', '/images/gallery/22.jpg'],
  ['/images/gallery/thumb-23.jpg', '/images/gallery/23.jpg'],
  ['/images/gallery/thumb-24.jpg', '/images/gallery/24.jpg'],
  ['/images/gallery/thumb-25.jpg', '/images/gallery/25.jpg'],
  ['/images/gallery/thumb-26.jpg', '/images/gallery/26.jpg'],
  ['/images/gallery/thumb-27.jpg', '/images/gallery/27.jpg'],
  ['/images/gallery/thumb-28.jpg', '/images/gallery/28.jpg'],
  ['/images/gallery/thumb-29.jpg', '/images/gallery/29.jpg'],
  ['/images/gallery/thumb-30.jpg', '/images/gallery/30.jpg']
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
