// components/ProductBanner.tsx

type ProductBannerProps = {
  showFallback:boolean;
  setShowFallback: React.Dispatch<React.SetStateAction<boolean>>; 
};

export default function ProductBanner({ showFallback, setShowFallback }:ProductBannerProps):JSX.Element {
  return (
    <div className="position-relative overflow-hidden d-none d-md-block" style={{ height: "350px" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          zIndex: 1,
        }}
      ></div>

      <div className="position-relative overflow-hidden" style={{ height: "350px" }}>
        {!showFallback ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-100"
            style={{
              height: "100%",
              objectFit: "cover",
              objectPosition: "bottom",
              position: "relative",
            }}
            onError={() => setShowFallback(true)}
          >
            <source src={`${process.env.PUBLIC_URL}/video.mp4`} type="video/mp4" />
          </video>
        ) : (
          <img
            src={`${process.env.PUBLIC_URL}/fallback.png`}
            alt="影片無法播放，顯示替代圖片"
            className="w-100"
            style={{
              height: "100%",
              objectFit: "cover",
              objectPosition: "bottom",
              position: "relative",
            }}
          />
        )}
      </div>
    </div>
  );
}
