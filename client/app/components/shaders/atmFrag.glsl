// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// also helpful code https://tympanus.net/codrops/2024/07/09/creating-an-animated-displaced-sphere-with-a-custom-three-js-material/
// depth texture codes at https://github.com/mrdoob/three.js/blob/70cc4e192fe2ebd0bf8542a81c8c513d61984c58/examples/webgl_depth_texture.html
// and https://discourse.threejs.org/t/reading-from-depth-texture/51344
// and docs at https://threejs.org/docs/?q=depth#api/en/textures/DepthTexture

uniform vec3 lightDir;
uniform sampler2D depthTexture;
varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vCol;
varying vec2 vUv;


void main() {
    
    gl_FragColor = texture2D(depthTexture, vUv);

    // float camDot = dot(vNorm, cameraPosition) / length(cameraPosition);
    // float lightDot = dot(vNorm, lightDir) / length(lightDir);
    // float outFloat = camDot * lightDot;
    // gl_FragColor = vec4(outFloat, outFloat, outFloat, 0.1);
}