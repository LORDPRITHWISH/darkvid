"use client";

import "@videojs/react/video/skin.css";
import "./dark-player.css";
import { createPlayer, videoFeatures } from "@videojs/react";
import { VideoSkin, Video } from "@videojs/react/video";
import { forwardRef, type VideoHTMLAttributes } from "react";

const Player = createPlayer({ features: videoFeatures });

interface DarkPlayerProps
  extends Omit<VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  src: string;
}

export const DarkPlayer = forwardRef<HTMLVideoElement, DarkPlayerProps>(
  ({ src, poster, ...videoProps }, ref) => {
    if (!src) {
      return (
        <div className="dark-player-wrapper">
          <div className="dark-player-loading">
            <div className="dark-player-loading__spinner" />
          </div>
        </div>
      );
    }

    return (
      <div className="dark-player-wrapper">
        <Player.Provider>
          <Player.Container>
            <VideoSkin>
              <Video
                ref={ref}
                src={src}
                poster={poster}
                playsInline
                {...videoProps}
              />
            </VideoSkin>
          </Player.Container>
        </Player.Provider>
      </div>
    );
  }
);

DarkPlayer.displayName = "DarkPlayer";
