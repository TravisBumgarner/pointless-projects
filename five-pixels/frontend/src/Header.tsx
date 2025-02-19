const MoreFromTheCreator = () => {
  return (
    <div
      style={{
        width: "100%",
        marginBottom: '5px',
        padding: '0 5px',
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <h1>Five Pixels</h1>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginRight: "10px",
          }}
          href="https://travisbumgarner.dev"
        >
          Creator Info
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
