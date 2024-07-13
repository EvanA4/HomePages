// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vCol;
varying vec2 vUv;

void main() {
    vPos = position;
    vNorm = normal;
    vCol = vec3(1.);
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}