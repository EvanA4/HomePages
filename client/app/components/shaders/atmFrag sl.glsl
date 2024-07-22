// #version 450
// most uniforms and attributes are already provided by ThreeJS
// see docs at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// also helpful code https://tympanus.net/codrops/2024/07/09/creating-an-animated-displaced-sphere-with-a-custom-three-js-material/
// depth texture codes at https://github.com/mrdoob/three.js/blob/70cc4e192fe2ebd0bf8542a81c8c513d61984c58/examples/webgl_depth_texture.html
// and https://discourse.threejs.org/t/reading-from-depth-texture/51344
// and docs at https://threejs.org/docs/?q=depth#api/en/textures/DepthTexture

uniform sampler2D depthTxt;
uniform sampler2D colorTxt;
uniform sampler2D opticalTxt;
uniform vec3 atmPos;
uniform float atmR;
uniform vec3 meshPos;
uniform vec2 meshDim;
uniform mat4 projectionInverse;
uniform mat4 modelMatrix;
uniform vec3 lightPos;
varying vec2 vUv;

const int numInScatteringPoints = 20;
const int opticalDepthSteps = 10;
const float densityFalloff = 1.;
const float scatteringStrength = 1.;
const float planetR = 1.;
const vec3 wavelengths = vec3(700., 530., 440.);
const vec3 planetPos = vec3(0.);
const float intensity = 1.;

struct Ray {
  vec3 origin;
  vec3 dir;
};


Ray create_screen_ray() {
  Ray outRay;
  vec3 camRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 camUp = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 upTrans = camUp * (vUv.y - .5) * meshDim.y;
  vec3 rightTrans = camRight * (vUv.x - .5) * meshDim.x;
  outRay.origin = meshPos + upTrans + rightTrans;
  outRay.dir = normalize(outRay.origin - cameraPosition);
  return outRay;
}


float world_depth(vec2 uv) {
  // returns real world distance from camera to pixel
  // thanks to https://discourse.threejs.org/t/reconstruct-world-position-in-screen-space-from-depth-buffer/5532/2
  float normalizedDepth = texture2D(depthTxt, uv).r; 
		
  vec4 ndc = vec4(
    (uv.x - 0.5) * 2.0,
    (uv.y - 0.5) * 2.0,
    (normalizedDepth - 0.5) * 2.0,
    1.0);
  
  vec4 clip = projectionInverse * ndc;
  vec4 view = modelMatrix * (clip / clip.w);
  vec3 result = view.xyz;
  vec3 camPos = meshPos + vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]) * .1;
  return length(result - camPos);
}


vec2 pierce_atm(vec3 rayOrigin, vec3 rayDir) {
  // returns (distance to sphere, length of path through sphere)
  // credit to Sebastian Lague at https://www.youtube.com/watch?v=DxfEbulyFcY&t=154s

  // solve parameterized equation for sphere collision https://viclw17.github.io/2018/07/16/raytracing-ray-sphere-intersection
  vec3 originDiff = rayOrigin - atmPos;
  float b = 2. * dot(rayDir, originDiff);
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


float densityAtPoint(vec3 densitySamplePoint) {
  float heightAboveSurface = length(densitySamplePoint - planetPos) - planetR;
  float height01 = heightAboveSurface / (atmR - planetR);
  float localDensity = exp(-height01 * densityFalloff) * (1. - height01);
  return localDensity;
}


float opticalDepthBaked(vec3 rayOrigin, vec3 rayDir) {
  float height = length(rayOrigin - planetPos) - planetR;
  float height01 = clamp(height / (atmR - planetR), 0., 1.);

  float uvX = 1. - (dot(normalize(rayOrigin - planetPos), rayDir) * .5 + .5);
  return texture2D(opticalTxt, vec2(uvX, height01)).r;
}


float opticalDepthBaked2(vec3 rayOrigin, vec3 rayDir, float rayLength) {
  vec3 endPoint = rayOrigin + rayDir * rayLength;
  float d = dot(rayDir, normalize(rayOrigin - planetPos));
  float opticalDepth = 0.;

  const float blendStrength = 1.5;
  float w = clamp(d * blendStrength + .5, 0., 1.);
  
  float d1 = opticalDepthBaked(rayOrigin, rayDir) - opticalDepthBaked(endPoint, rayDir);
  float d2 = opticalDepthBaked(endPoint, -rayDir) - opticalDepthBaked(rayOrigin, -rayDir);

  opticalDepth = mix(d2, d1, w);
  return opticalDepth;
}


vec3 calculateLight(vec3 rayOrigin, vec3 rayDir, float rayLength, vec3 originalCol, vec2 uv) {
  // float blueNoise = tex2Dlod(_BlueNoise, float4(squareUV(uv) * ditherScale,0,0));
  // blueNoise = (blueNoise - 0.5) * ditherStrength;
  
  vec3 inScatterPoint = rayOrigin;
  float scatterPoints = float(numInScatteringPoints);
  float stepSize = rayLength / (scatterPoints - 1.);
  vec3 inScatteredLight = vec3(0.);
  float viewRayOpticalDepth = 0.;

  for (int i = 0; i < numInScatteringPoints; i ++) {
    // float sunRayLength = raySphere(planetPos, atmR, inScatterPoint, lightPos)[1];
    // float sunRayOpticalDepth = opticalDepthBaked(inScatterPoint + lightPos * ditherStrength, lightPos);
    float sunRayOpticalDepth = opticalDepthBaked(inScatterPoint + lightPos, lightPos);
    float localDensity = densityAtPoint(inScatterPoint);
    float floatI = float(i);
    viewRayOpticalDepth = opticalDepthBaked2(rayOrigin, rayDir, stepSize * floatI);
    // vec3 transmittance = exp(-(sunRayOpticalDepth + viewRayOpticalDepth) * scatteringCoefficients);
    vec3 transmittance = vec3(exp(-(sunRayOpticalDepth + viewRayOpticalDepth)));
    
    inScatteredLight += localDensity * transmittance;
    inScatterPoint += rayDir * stepSize;
  }
  // inScatteredLight *= scatteringCoefficients * intensity * stepSize / planetRadius;
  inScatteredLight *= intensity * stepSize / planetR;
  // inScatteredLight += blueNoise * 0.01;

  // Attenuate brightness of original col (i.e light reflected from planet surfaces)
  // This is a hacky mess, TODO: figure out a proper way to do this
  const float brightnessAdaptionStrength = 0.15;
  const float reflectedLightOutScatterStrength = 3.;
  float brightnessAdaption = dot(inScatteredLight, vec3(1.)) * brightnessAdaptionStrength;
  float brightnessSum = viewRayOpticalDepth * intensity * reflectedLightOutScatterStrength + brightnessAdaption;
  float reflectedLightStrength = exp(-brightnessSum);
  float hdrStrength = clamp(dot(originalCol, vec3(1.))/ 3. - 1., 0., 1.);
  reflectedLightStrength = mix(reflectedLightStrength, 1., hdrStrength);
  vec3 reflectedLight = originalCol * reflectedLightStrength;

  vec3 finalCol = reflectedLight + inScatteredLight;


  return finalCol;
}


void main() {
  vec4 originalCol = texture2D(colorTxt, vUv);
  float sceneDepth = world_depth(vUv);

  Ray current = create_screen_ray();            
  vec3 rayOrigin = current.origin;
  vec3 rayDir = current.dir;
    
  vec2 hitInfo = pierce_atm(rayOrigin, rayDir);
  float dstToAtmosphere = hitInfo[0];
  float dstThroughAtmosphere = min(hitInfo[1], sceneDepth - dstToAtmosphere);
  
  // gl_FragColor = vec4(vec3(dstToAtmosphere), 1);

  if (dstThroughAtmosphere > 0.) {
    const float epsilon = 0.0001;
    vec3 pointInAtmosphere = rayOrigin + rayDir * (dstToAtmosphere + epsilon);
    vec3 light = calculateLight(pointInAtmosphere, rayDir, dstThroughAtmosphere - epsilon * 2., originalCol.rgb, vUv);
    gl_FragColor = vec4(light, 1.);
  } else {
    gl_FragColor = originalCol;
  }
}