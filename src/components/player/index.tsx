"use client";

import "@videojs/react/video/skin.css";
import "./dark-player.css";
import { createPlayer, videoFeatures } from "@videojs/react";
import { VideoSkin, Video } from "@videojs/react/video";

const Player = createPlayer({ features: videoFeatures });

interface MyPlayerProps {
  src: string;
}

export const DarkPlayer = ({ src }: MyPlayerProps) => {
  return (
    <div className="dark-player-wrapper">
      <Player.Provider>
        <Player.Container>
          <VideoSkin>
            <Video src={src} playsInline />
          </VideoSkin>
        </Player.Container>
      </Player.Provider>
    </div>
  );
};
