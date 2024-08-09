// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// more code at https://threejs.org/docs/index.html?q=shader#api/en/materials/ShaderMaterial

varying vec2 vUv;
varying vec3 vNorm;

void main () {
    vec3 camDir = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
    float diff = dot(vNorm, camDir);
    gl_FragColor = vec4(1., 1., 0., 1.);
}