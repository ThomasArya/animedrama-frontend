import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Hls from "hls.js";

export type HlsVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
};

export const HlsVideo = forwardRef<HTMLVideoElement, HlsVideoProps>(
  ({ src, children, ...props }, ref) => {
    const innerRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLVideoElement);

    useEffect(() => {
      const video = innerRef.current;
      if (!video || !src) return;

      const isHls = /\.m3u8(\?.*)?$/i.test(src);

      if (!isHls || video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        return () => hls.destroy();
      }

      video.src = src;
    }, [src]);

    return (
      <video ref={innerRef} {...props}>
        {children}
      </video>
    );
  },
);

HlsVideo.displayName = "HlsVideo";
