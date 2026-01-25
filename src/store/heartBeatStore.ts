import { heartbeatVideoWatch, endVideoWatch, startVideoWatch } from "@/services/video.service";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// let heartbeatInterval: NodeJS.Timeout | null = null;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

type HeartBeatState = {
  videoId: string | null;
  sessionId: string | null;
  lastPosition: number;

  initializeHeartBeat: (videoId: string, sessionId: string, lastPosition: number) => void;

  updateLastPosition: (position: number) => void;

  startHeartBeat: () => void;

  stopHeartBeat: () => void;

  endHeartBeat: () => void;

  cleanPlayer: () => void;
};

export const useHeartBeatStore = create<HeartBeatState>()(
  devtools(
    (set, get) => ({
      videoId: null,
      sessionId: null,
      lastPosition: 0,

      initializeHeartBeat: (videoId, sessionId, lastPosition) => {
        const current = get();
        if (current.videoId === videoId && current.sessionId === sessionId) {
          return;
        }

        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }

        if (current.videoId && current.sessionId) {
          endVideoWatch(current.videoId, current.sessionId, current.lastPosition).catch((err) => {
            console.error("Error stopping previous video watch:", err);
          });
        }
        set({ videoId, sessionId, lastPosition });
      },

      updateLastPosition: (position) => {
        set({ lastPosition: position });
      },

      startHeartBeat: () => {
        const { videoId, sessionId } = get();

        if (!videoId || !sessionId) {
          console.warn("Heartbeat not started: missing videoId/sessionId");
          return;
        }

        // Prevent duplicate intervals
        if (heartbeatInterval) return;

        heartbeatInterval = setInterval(async () => {
          const { lastPosition } = get();

          try {
            await heartbeatVideoWatch(videoId, sessionId, lastPosition);
          } catch (err) {
            console.error("Heartbeat failed:", err);

            const error = err as { status?: number };
            if (error.status === 400 || error.status === 410) {
              startVideoWatch(videoId, sessionId);
            }
          }

          console.log(`Heartbeat sent for video ${videoId} at position ${lastPosition}`);
        }, 5000); // 5s heartbeat
      },

      stopHeartBeat: () => {
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
      },

      cleanPlayer: () => {
        const { videoId, sessionId, lastPosition } = get();

        if (videoId && sessionId) {
          endVideoWatch(videoId, sessionId, lastPosition).catch((err) => {
            console.error("Error stopping video watch during cleanup:", err);
          });
        }

        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }

        set({ videoId: null, sessionId: null, lastPosition: 0 });
      },
    }),
    {
      name: "heartbeat-store",
    },
  ),
);
