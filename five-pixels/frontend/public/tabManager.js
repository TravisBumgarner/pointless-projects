// tabManager.js (worker script)
const connections = new Set();
let isFirstTab = false;

self.onconnect = (e) => {
  const port = e.ports[0];
  isFirstTab = connections.size === 0;
  connections.add(port);

  // Send initial status to the newly connected tab
  port.postMessage({
    type: "TAB_STATUS",
    isFirstTab,
  });

  port.onclose = () => {
    connections.delete(port);
  };
};
