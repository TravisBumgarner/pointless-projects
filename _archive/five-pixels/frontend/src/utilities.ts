export function playSound(type: "beep" | "gameOver") {
    const audioCtx = new window.AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
  
    switch (type) {
      case "beep": // Friendly beep
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
        break;
  
      case "gameOver": // Alarming "game over" sound
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.6);
        oscillator.stop(audioCtx.currentTime + 0.6);
        break;
  
      default:
        console.warn("Unknown sound type");
        return;
    }
  
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  }

  