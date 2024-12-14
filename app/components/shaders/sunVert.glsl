// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// more code at https://threejs.org/docs/index.html?q=shader#api/en/materials/ShaderMaterial

varying vec2 vUv;
varying vec3 vNorm;

vec3 wavePos(vec3 position) {
    return vec3(0.);
}


void main () {
    vUv = uv;
    vec3 newPos = wavePos(position);
    vNorm = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}    