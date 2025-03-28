const Photo = ({ src }: { src: string }) => {
  const imagePath = new URL(`../../../data/images/${src}`, import.meta.url)
    .href;

  return (
    <div
      style={{
        width: "500px",
        height: "100vh",
      }}
    >
      <img
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        src={imagePath}
      />
    </div>
  );
};

export default Photo;
