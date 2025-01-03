import React from 'react';
import ReactDOM from 'react-dom/client';
import SomeHashImage from './SomeHashImage.tsx';
import output from './output.json';

function App() {
  return (
    <>
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {Object.entries(output).map(
        ([file, { hash, aspect_ratio, version }]) => {
          return (
            <div key={file} style={{ marginBottom: "30px", marginTop: "30px" }}>
              <SomeHashImage
                filename={file}
                hash={hash}
                version={version}
                aspect_ratio={aspect_ratio}
              />
            </div>
          );
        }
      )}
    </div>
    <div style={{position: "fixed", bottom: "20px", right: "20px"}}>
      <button onClick={() => window.location.reload()}>Animate</button>
    </div>
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);
