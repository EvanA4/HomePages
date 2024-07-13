// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// also helpful code https://tympanus.net/codrops/2024/07/09/creating-an-animated-displaced-sphere-with-a-custom-three-js-material/

uniform sampler2D colorMap;
varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vCol;
varying vec2 vUv;


struct Ray {
    vec3 origin;
    vec3 dir;
};


void main() {
    // Ray myRay = 1;

    // vec3 color = vCol * dot(vNorm, );

    // gl_FragColor = vec4(normalize(vPos), 1.);

    // gl_FragColor = vec4(vUv, 0., 1.);

    // float dist = distance(vPos, cameraPosition);
    // gl_FragColor = vec4(dist, dist, dist, 1.);

    // float camDot = dot(vNorm, cameraPosition) / length(cameraPosition);
    // gl_FragColor = vec4(camDot, camDot, camDot, 1.);

    vec4 color = texture2D(colorMap, vUv);
    float camDot = dot(vNorm, cameraPosition) / length(cameraPosition);
    color *= camDot;
    gl_FragColor = vec4(color.xyz, 1.);
}