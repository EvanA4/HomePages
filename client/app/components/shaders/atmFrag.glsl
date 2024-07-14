// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// also helpful code https://tympanus.net/codrops/2024/07/09/creating-an-animated-displaced-sphere-with-a-custom-three-js-material/

uniform vec3 lightDir;
varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vCol;
varying vec2 vUv;


void main() {
    // Ray myRay = 1;

    // vec3 color = vCol * dot(vNorm, );

    // gl_FragColor = vec4(normalize(vPos), 1.);

    // gl_FragColor = vec4(vUv, 0., 1.);

    // float dist = distance(vPos, cameraPosition);
    // gl_FragColor = vec4(dist, dist, dist, 1.);

    float camDot = dot(vNorm, cameraPosition) / length(cameraPosition);
    float lightDot = dot(vNorm, lightDir) / length(lightDir);
    float outFloat = camDot * lightDot;
    gl_FragColor = vec4(outFloat, outFloat, outFloat, 0.1);
}