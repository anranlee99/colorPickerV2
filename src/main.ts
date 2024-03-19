import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
const canvas = document.createElement('canvas');

const ctx = canvas.getContext('2d')!;
canvas.width = 800;
canvas.height = 800;
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 800, 800);




const imageData =ctx.createImageData(800, 800); 
for (let y = 0; y < 800; y++) {
  for (let x = 0; x < 800; x++) {
      const i = (y * 800 + x) * 4; // Calculate the index in the imageData array

      // Generate colors based on x and y positions
      const r = Math.floor(x * 255 / 799);
      const g = Math.floor(y * 255 / 799);
      const b = Math.floor((x + y) * 255 / (799 * 2));

      imageData.data[i + 0] = r;
      imageData.data[i + 1] = g;
      imageData.data[i + 2] = b;
      imageData.data[i + 3] = 255; // Full opacity
  }
}

const originalData = new Uint8ClampedArray(imageData.data);
console.log(imageData);
ctx.putImageData(imageData, 0, 0);

app.appendChild(canvas);

canvas.addEventListener('mousemove', (e) => {
  imageData.data.set(originalData);
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  console.log(x, y);
  undoHighlight();
  highlightRadius(x, y, 100);
})
const changedPixels: number[] = []
function highlightRadius(x: number, y: number, r: number) {
  const data = imageData.data;
  const width = imageData.width;

  // Calculate the bounding box
  const startX = Math.max(x - r, 0);
  const startY = Math.max(y - r, 0);
  const endX = Math.min(x + r, width - 1);
  const endY = Math.min(y + r, imageData.height - 1);

  for (let py = startY; py <= endY; py++) {
    for (let px = startX; px <= endX; px++) {
      const i = (py * width + px) * 4;
      const dx = x - px;
      const dy = y - py;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < r) {
        // Brighten the color by increasing R, G, and B values
        data[i + 0] = Math.min(255, data[i + 0] + 50);
        data[i + 1] = Math.min(255, data[i + 1] + 50);
        data[i + 2] = Math.min(255, data[i + 2] + 50);
        changedPixels.push(i);
    }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function undoHighlight() {
  
  const data = imageData.data;
  for (let i = 0; i < changedPixels.length; i++) {
    const idx = changedPixels[i];
    data[idx + 0] = originalData[idx + 0];
    data[idx + 1] = originalData[idx + 1];
    data[idx + 2] = originalData[idx + 2];
    data[idx + 3] = originalData[idx + 3];
  }
  ctx.putImageData(imageData, 0, 0);
  changedPixels.length = 0;
}

