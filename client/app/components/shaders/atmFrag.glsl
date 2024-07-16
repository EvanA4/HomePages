#version 450
// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// also helpful code https://tympanus.net/codrops/2024/07/09/creating-an-animated-displaced-sphere-with-a-custom-three-js-material/
// depth texture codes at https://github.com/mrdoob/three.js/blob/70cc4e192fe2ebd0bf8542a81c8c513d61984c58/examples/webgl_depth_texture.html
// and https://discourse.threejs.org/t/reading-from-depth-texture/51344
// and docs at https://threejs.org/docs/?q=depth#api/en/textures/DepthTexture

uniform sampler2D depthTxt;
uniform vec3 atmPos;
uniform float atmR;
uniform float camNear;
uniform float camFar;
varying vec3 vPlanePos;
varying vec2 vUv;


struct Ray {
  vec3 origin;
  vec3 dir;
};


Ray create_ray() {
  Ray outRay;
  outRay.origin = cameraPosition;
  outRay.dir = vec3(vPlanePos - cameraPosition);
  return outRay;
}


float pierce_sphere(Ray ray) {
  // determines length of path ray travels through sphere
}


void main() {
  Ray current = create_ray();
  float pierce = pierce_sphere(current);

  float camDepth = texture2D(depthTxt, vUv).r;
  float realDepth = 2.0 * camNear * camFar / (camFar + camNear - camDepth * (camFar - camNear));
  gl_FragColor = vec4(vec3(realDepth), 1.);
}