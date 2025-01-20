const ConnectionError = () => {

    const handleRefresh = () => {
        window.location.reload();
    }
  return <div style={{position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000}}>Connection to server lost, refresh page. <button onClick={handleRefresh}>Refresh</button></div>;
};

export default ConnectionError;