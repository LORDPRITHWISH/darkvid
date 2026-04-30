"use client";

import "@videojs/react/video/skin.css";
import "./dark-player.css";
import { createPlayer, videoFeatures } from "@videojs/react";
import { Video } from "@videojs/react/video";
import { forwardRef, type VideoHTMLAttributes } from "react";
import { Monitor, MonitorX } from "lucide-react";
import { DarkVideoSkin } from "./DarkVideoSkin";


const Player = createPlayer({ features: videoFeatures });

interface DarkPlayerProps
  extends Omit<VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  src: string;
  cinemaMode?: boolean;
  onCinemaToggle?: () => void;
}

export const DarkPlayer = forwardRef<HTMLVideoElement, DarkPlayerProps>(
  ({ src, poster, cinemaMode, onCinemaToggle, ...videoProps }, ref) => {
    if (!src) {
      return (
        <div className="dark-player-wrapper">
          <div className="dark-player-loading">
            <div className="dark-player-loading__spinner" />
          </div>
        </div>
      );
    }

    // Cinema button styled to match native video.js controls
    const cinemaButton = onCinemaToggle ? (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCinemaToggle();
        }}
        type="button"
        className="media-button media-button--subtle media-button--icon media-button--cinema"
        title={cinemaMode ? "Exit cinema mode (Esc)" : "Cinema mode"}
      >
        {cinemaMode ? (
          <MonitorX className="media-icon" />
        ) : (
          <Monitor className="media-icon" />
        )}
      </button>
    ) : undefined;

    return (
      <div className="dark-player-wrapper">
        <Player.Provider>
          <Player.Container>
            <DarkVideoSkin poster={poster} cinemaButton={cinemaButton}>
              <Video
                ref={ref}
                src={src}
                
                poster={poster}
                playsInline
                {...videoProps}
              />
            </DarkVideoSkin>
          </Player.Container>
        </Player.Provider>
      </div>
    );
  }
);

DarkPlayer.displayName = "DarkPlayer";
