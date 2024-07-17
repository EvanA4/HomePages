// #version 450
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
varying vec2 vUv;
uniform vec3 meshPos;
uniform vec2 meshDim;


struct Ray {
  vec3 origin;
  vec3 dir;
};


Ray create_ray() {
  Ray outRay;
  vec3 camRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 camUp = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 upTrans = camUp * (vUv.y - .5) * meshDim.y;
  vec3 rightTrans = camRight * (vUv.x - .5) * meshDim.x;
  outRay.origin = meshPos + upTrans + rightTrans;
  outRay.dir = normalize(outRay.origin - cameraPosition);
  return outRay;
}


float pierce_atm(Ray ray) {
  // determines length of path ray travels through sphere

  // get distance to planet with depth texture
  float camDepth = texture2D(depthTxt, vUv).r;
  float realDepth = 2.0 * camNear * camFar / (camFar + camNear - camDepth * (camFar - camNear));
  // realDepth = camNear * camFar / (camFar - camNear * camDepth - camFar);

  // solve parameterized equation for sphere collision https://viclw17.github.io/2018/07/16/raytracing-ray-sphere-intersection
  vec3 originDiff = ray.origin - atmPos;
  float b = 2. * dot(ray.dir, originDiff);
  float c = dot(originDiff, originDiff) - atmR * atmR;
  float disc = b * b - 4. * c;

  if (disc > 0.) {
    float sqrtDisc = sqrt(disc);
    float distNearIntersect = max(0., (-b - sqrtDisc) / 2.); // max for in case camera is inside sphere
    float distFarIntersect = (-b + sqrtDisc) / 2.;
    float rawAtmDepth = distFarIntersect - distNearIntersect;
    return min(realDepth - distNearIntersect, rawAtmDepth);
  }

  return 0.;
}


void main() {
  Ray current = create_ray();
  float atmDepth = pierce_atm(current);

  float camDepth = texture2D(depthTxt, vUv).r;
  float realDepth;
  // realDepth = 2.0 * camNear * camFar / (camFar + camNear - camDepth * (camFar - camNear)); // ChatGPT
  // realDepth = (2.0 * camNear) / (camFar + camNear - camDepth * (camFar - camNear)); // ChatGPT again
  // realDepth = camNear / (camFar - camDepth * (camFar - camNear)); // ChatGPT again again
  // realDepth = camNear * camFar  / ( (camFar - ( camNear )) * ( camDepth ) - ( camFar ) ); // perspectiveDepthToViewZ
  // realDepth = camNear - ( camFar ) * ( camDepth ) - ( camNear ); // orthographicDepthToViewZ
  realDepth = camDepth * camFar;

  // camNear is .1
  // camFar is 1000


  gl_FragColor = vec4(vec3(realDepth), 1.);
}