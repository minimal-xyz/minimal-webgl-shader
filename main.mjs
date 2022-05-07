import * as twgl from "twgl.js";

twgl.setDefaults({ attribPrefix: "a_" });
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext("webgl");

const vs = `
  uniform vec4 u_offsets;
  attribute vec2 a_position;

  varying vec2 v_position;

  void main() {
    v_position = a_position;
    gl_Position = vec4(a_position + vec2(0.1, 0.2), 0, 1.);
  }
`;
const fs = `
  precision mediump float;

  varying vec2 v_position;

  void main() {
    gl_FragColor = vec4(1., 1., 0.5, 1.0);
  }
`;

const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

const numLines = 4;
const arrays = {
  position: twgl.primitives.createAugmentedTypedArray(2, numLines * 2),
  // indices: [0, 3, 1],
};
// you may also delare positions in combination with `indices` to reuse points

let points = [
  [-0.5, -0.5],
  [-0.5, 0.5],

  [-0.5, 0.5],
  [0.5, 0.5],

  [0.5, 0.5],
  [0.5, -0.5],

  [0.5, -0.5],
  [-0.5, -0.5],
];

let idx = 0;
for (let p of points) {
  arrays.position[idx++] = p[0];
  arrays.position[idx++] = p[1];
}

console.log("position", arrays.position);

const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
const offsets = [0, 0, 0, 1];
const uniforms = {
  u_offsets: offsets,
};

function render(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);

  twgl.drawBufferInfo(gl, bufferInfo, gl.LINES);
  // twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);

  // requestAnimationFrame(render);
}

requestAnimationFrame(render);
