"use client";

export default function HandsOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      <img
        src="/stay2.png"
        alt="Left Hand"
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "20vw",
          pointerEvents: "none",
        }}
        draggable={false}
      />
      <img
        src="/leave3.png"
        alt="Right Hand"
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "20vw",
          pointerEvents: "none",
        }}
        draggable={false}
      />
    </div>
  );
}
