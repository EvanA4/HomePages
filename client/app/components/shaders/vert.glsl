// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}