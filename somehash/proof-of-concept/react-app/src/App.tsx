import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import output from './output.json';

function base64_to_rgb(base64: string) {
  const decoded = atob(base64);
  const colors = decoded.split('_').map(color => {
    const [r, g, b] = color.split('-').map(Number);
    return `rgb(${r}, ${g}, ${b})`;
  });

  return colors
}

const Preview = styled.div<{colors: string[], width: number, height: number}>`
  background: ${({colors}) => `linear-gradient(to right, ${colors.join(', ')})`};
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
`

const Image = ({filename, colors, width, height}: {filename: string, colors: string[], width: number, height: number}) => {
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // setShowPreview(false);
    }, 1000);
  }, []);

  return (
    <div>
      {showPreview ? <Preview colors={colors} width={width} height={height} /> : <img alt={filename} src={filename} />}
      <div>
      {colors.map(color => {
        return <div style={{width: 50, display: 'inline-block', height: 50, backgroundColor: color}}></div>
      })}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="App">
    {Object.entries(output).map(([file, colors]) => {
      return (
        <div key={file}>
          <h1>{file}</h1>
          <p>{base64_to_rgb(colors)}</p>
          <Image filename={file} colors={base64_to_rgb(colors)} width={100} height={100} />
        </div>
      )
    })}
    </div>
  );
}

export default App;
