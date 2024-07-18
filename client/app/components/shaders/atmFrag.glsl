// #version 450
// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// also helpful code https://tympanus.net/codrops/2024/07/09/creating-an-animated-displaced-sphere-with-a-custom-three-js-material/
// depth texture codes at https://github.com/mrdoob/three.js/blob/70cc4e192fe2ebd0bf8542a81c8c513d61984c58/examples/webgl_depth_texture.html
// and https://discourse.threejs.org/t/reading-from-depth-texture/51344
// and docs at https://threejs.org/docs/?q=depth#api/en/textures/DepthTexture

uniform sampler2D depthTxt;
uniform sampler2D colorTxt;
uniform vec3 atmPos;
uniform float atmR;
uniform vec3 meshPos;
uniform vec2 meshDim;
uniform mat4 projectionInverse;
uniform mat4 modelMatrix;

varying vec2 vUv;


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


float world_depth() {
  // returns real world distance from camera to pixel
  // thanks to https://discourse.threejs.org/t/reconstruct-world-position-in-screen-space-from-depth-buffer/5532/2
  float normalizedDepth = texture2D(depthTxt, vUv).r; 
		
  vec4 ndc = vec4(
    (vUv.x - 0.5) * 2.0,
    (vUv.y - 0.5) * 2.0,
    (normalizedDepth - 0.5) * 2.0,
    1.0);
  
  vec4 clip = projectionInverse * ndc;
  vec4 view = modelMatrix * (clip / clip.w);
  vec3 result = view.xyz;
  vec3 camPos = meshPos + vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]) * .1;
  return length(result - camPos);
}


vec2 ray_sphere(Ray ray) {
  // returns (distance to sphere, length of path through sphere)
  // credit to Sebastian Lague at https://www.youtube.com/watch?v=DxfEbulyFcY&t=154s

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

    if (distFarIntersect >= 0.)
      return vec2(distNearIntersect, rawAtmDepth);
  }

  return vec2(3.402823466e+38, 0.);
}


float atm_depth(Ray ray) {
  float realDepth = world_depth();
  vec2 atmDepth = ray_sphere(ray);
  return min(atmDepth[1], realDepth - atmDepth[0]);
}


void main() {
  Ray current = create_ray();

  float atmDepth = atm_depth(current);

  gl_FragColor = vec4(vec3(atmDepth / atmR / 2.), .8);
}