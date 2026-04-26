/**
 * Custom Video Skin — wraps the stock VideoSkin and injects the cinema
 * button into the right-hand button group using DOM insertion after mount.
 *
 * This avoids deep-importing internal @videojs/react icon modules (which
 * aren't exported) while still placing the cinema button inline with
 * the native controls.
 */

import { type PropsWithChildren, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VideoSkin } from "@videojs/react/video";

export interface DarkVideoSkinProps extends PropsWithChildren {
  poster?: string;
  /** ReactNode to inject between PiP and Fullscreen buttons. */
  cinemaButton?: ReactNode;
}

export function DarkVideoSkin({
  children,
  poster,
  cinemaButton,
}: DarkVideoSkinProps) {
  const skinRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!skinRef.current || !cinemaButton) return;

    const injectContainer = () => {
      if (!skinRef.current) return false;

      // Find the fullscreen button in the right-side controls group
      const fullscreenBtn = skinRef.current.querySelector(
        ".media-controls .media-button-group:last-child .media-button--fullscreen"
      );

      if (!fullscreenBtn) return false;

      // Check if we already injected a container
      const existing = skinRef.current.querySelector(".dark-cinema-portal");
      if (existing) {
        setPortalTarget(existing as HTMLElement);
        return true;
      }

      // Create a wrapper element and insert it before the fullscreen button
      const wrapper = document.createElement("span");
      wrapper.className = "dark-cinema-portal";
      wrapper.style.display = "contents"; // invisible wrapper, doesn't affect layout
      fullscreenBtn.parentElement?.insertBefore(wrapper, fullscreenBtn);
      setPortalTarget(wrapper);
      return true;
    };

    if (!injectContainer()) {
      const observer = new MutationObserver(() => {
        if (injectContainer()) observer.disconnect();
      });
      observer.observe(skinRef.current, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [cinemaButton]);

  return (
    <div ref={skinRef} style={{ display: "contents" }}>
      <VideoSkin poster={poster}>
        {children}
      </VideoSkin>

      {/* Portal the cinema button before the fullscreen button */}
      {cinemaButton && portalTarget
        ? createPortal(cinemaButton, portalTarget)
        : null}
    </div>
  );
}
