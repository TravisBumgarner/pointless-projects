// tabManager.js (worker script)
const connections = new Set();
let isFirstTab = false;

self.onconnect = (e) => {
  console.log("connect");
  const port = e.ports[0];
  console.log(connections.size);
  isFirstTab = connections.size === 0;
  connections.add(port);

  // Send initial status to the newly connected tab
  port.postMessage({
    type: "TAB_STATUS",
    isFirstTab,
  });

  port.onclose = () => {
    console.log("close");
    connections.delete(port);
  };
};
