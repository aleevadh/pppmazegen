const cols = 20, rows = 20, size = 20;

let grid = [], stack = [], current, svgContent = "";

const dirs = [
  [0, -1, 0], 
  [1, 0, 1], 
  [0, 1, 2],  
  [-1, 0, 3]  
];

function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.v = 0;
  this.w = [1, 1, 1, 1];
}

const idx = (x, y) => (x < 0 || y < 0 || x >= cols || y >= rows ? -1 : x + y * cols);

function setup() {
  grid = Array.from({ length: cols * rows }, (_, i) =>
    new Cell(i % cols, (i / cols) | 0)
  );
  current = grid[0];
}

function neighbors(c) {
  return dirs
    .map(([dx, dy]) => grid[idx(c.x + dx, c.y + dy)])
    .filter(n => n && !n.v);
}

function remove(a, b) {
  let dx = a.x - b.x, dy = a.y - b.y;
  if (dx === 1) a.w[3] = b.w[1] = 0;
  else if (dx === -1) a.w[1] = b.w[3] = 0;
  else if (dy === 1) a.w[0] = b.w[2] = 0;
  else if (dy === -1) a.w[2] = b.w[0] = 0;
}

function generate() {
  setup();
  stack = [];

  do {
    current.v = 1;
    let n = neighbors(current);

    if (n.length) {
      let next = n[Math.random() * n.length | 0];
      stack.push(current);
      remove(current, next);
      current = next;
    } else current = stack.pop();
  } while (stack.length);
}

function svg() {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * size}" height="${rows * size}">`;

  for (let c of grid) {
    let x = c.x * size, y = c.y * size;

    c.w.forEach((w, i) => {
      if (!w) return;

      //in -out
      if (c.x === 0 && c.y === 0 && i === 0) return;
      if (c.x === cols - 1 && c.y === rows - 1 && i === 1) return;

      const L = [
        [x, y, x + size, y],               
        [x + size, y, x + size, y + size], 
        [x + size, y + size, x, y + size], 
        [x, y + size, x, y]                
      ][i];

      s += `<line x1="${L[0]}" y1="${L[1]}" x2="${L[2]}" y2="${L[3]}" stroke="black"/>`;
    });
  }

  return s + "</svg>";
}

function render() {
  svgContent = svg();
  document.getElementById("maze").innerHTML = svgContent;
}

function generateMaze() {
  generate();
  render();
}

function downloadSVG() {
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "maze.svg";
  a.click();
}

generateMaze();
