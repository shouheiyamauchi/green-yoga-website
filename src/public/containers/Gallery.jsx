import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex: 0,
      isOpen: false
    };
    this.openImage = this.openImage.bind(this);
    this.setThumbnail = this.setThumbnail.bind(this);
  };

  openImage(index) {
    this.setState({
      isOpen: true,
      photoIndex: index
    })
  }

  setThumbnail(image) {
    const thumbnail = {
      width: "25%",
      paddingTop: "25%",
      margin: "0.5em",
      backgroundImage: `url(${image[0]})`,
      backgroundPositionX: 'center',
      backgroundPositionY: 'center',
      backgroundRepeat: 'no-repeat',
      WebkitBackgroundSize: "cover",
      MozBackgroundSize: "cover",
      OBackgroundSize: "cover",
      backgroundSize: "cover"
    }
    return thumbnail
  }

  // example images prop
  // first item in each array is the thumbnail URL
  //
  // const images = [
  //   ['/images/front-page/thumb-1.jpg', '/images/front-page/1.jpg'],
  //   ['/images/front-page/thumb-2.jpg', '/images/front-page/2.jpg'],
  //   ['/images/gallery/thumb-3.jpg', '/images/gallery/3.jpg'],
  //   ['/images/gallery/thumb-4.jpg', '/images/gallery/4.jpg'],
  //   ['/images/gallery/thumb-5.jpg', '/images/gallery/5.jpg'],
  //   ['/images/gallery/thumb-6.jpg', '/images/gallery/6.jpg'],
  //   ['/images/gallery/thumb-7.jpg', '/images/gallery/7.jpg'],
  //   ['/images/gallery/thumb-8.jpg', '/images/gallery/8.jpg']
  // ];

  render() {
    const {
      photoIndex,
      isOpen,
    } = this.state;

    return (
      <div>
        <div className="gallery-grid">
          {this.props.images.map((image, i) =>
            <div key={i} className="hoverable pointer" style={this.setThumbnail(this.props.images[i])} onClick={() => this.openImage(i)} />
          )}
        </div>

        {isOpen &&
          <Lightbox
            mainSrc={this.props.images[photoIndex][1]}
            nextSrc={this.props.images[(photoIndex + 1) % this.props.images.length][1]}
            prevSrc={this.props.images[(photoIndex + this.props.images.length - 1) % this.props.images.length][1]}
            enableZoom={false}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() => this.setState({
              photoIndex: (photoIndex + this.props.images.length - 1) % this.props.images.length,
            })}
            onMoveNextRequest={() => this.setState({
              photoIndex: (photoIndex + 1) % this.props.images.length,
            })}
          />
        }
      </div>
    );
  }
}

export default Gallery;
