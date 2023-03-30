import React from 'react';
import VideoJS from './VideoJS';
import videojs from 'video.js';
import Header from '../Header';
import SideNavBar from '../SideNavBar';
import { useParams } from 'react-router-dom';

const VideoPlaying = () => {

  const playerRef = React.useRef(null);
  let { videoUrl } = useParams();

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: videoUrl,
      type: 'video/mp4'
    }],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex flex-col h-full lg:flex-row">
            <SideNavBar />
            <main className="flex-grow bg-gray-900 p-10 sm:p-20 m-6 rounded-[50px] shadow-[0_35px_60px_-15px_rgba(0,0,0,1)]" style={{ maxWidth: '800px'}}>
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoPlaying;
