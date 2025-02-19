const MoreFromTheCreator = () => {
  return (
    <div
      style={{
        width: "100%",
        marginBottom: '10px',
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <h1>Five Pixels</h1>
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginRight: "10px",
          }}
          href="https://travisbumgarner.dev"
        >
          More from the Creator
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/TravisBumgarner/pointless-projects/tree/main/pixel-race"
        >
          Github
        </a>
      </div>
    </div>
  );
};

export default MoreFromTheCreator;
