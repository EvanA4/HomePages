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

const int numScatterPoints = 10;
const int opticalDepthSteps = 10;
const float densityFalloff = 12.;
const float scatteringStrength = 18.;
const float planetR = 1.;
const vec3 wavelengths = vec3(700., 530., 440.);

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


vec2 pierce_atm(Ray current) {
  // returns (distance to sphere, length of path through sphere)
  // credit to Sebastian Lague at https://www.youtube.com/watch?v=DxfEbulyFcY&t=154s

  // solve parameterized equation for sphere collision https://viclw17.github.io/2018/07/16/raytracing-ray-sphere-intersection
  vec3 originDiff = current.origin - atmPos;
  float b = 2. * dot(current.dir, originDiff);
  float c = dot(originDiff, originDiff) - atmR * atmR;
  float disc = b * b - 4. * c;

  if (disc > 0.) {
    float sqrtDisc = sqrt(disc);
    float distNearIntersect = max(0., (-b - sqrtDisc) / 2.); // max for in case camera is inside sphere
    float distFarIntersect = (-b + sqrtDisc) / 2.;
    float rawAtmDepth = distFarIntersect - distNearIntersect;

    if (distFarIntersect >= 0.)
      return vec2(distNearIntersect, rawAtmDepth );
  }

  return vec2(3.402823466e+38, 0.);
}


float density_at_point(vec3 point) {
  // credit to Sebastian Lague at https://www.youtube.com/watch?v=DxfEbulyFcY&t=154s

  float heightAboveSurface = length(point - atmPos) - planetR;
  float height01 = heightAboveSurface / (atmR - planetR);
  float localDensity = exp(-height01 * densityFalloff) * (1. - height01);
  return localDensity;
}


// float opticalDepthBaked(vec3 rayOrigin, vec3 rayDir) {
//   float height = length(rayOrigin - atmPos) - planetR;
//   float height01 = clamp(height / (atmR - planetR), 0., 1.);

//   float uvX = 1. - (dot(normalize(rayOrigin - atmPos), rayDir) * .5 + .5);
//   return texture2D(opticalTxt, vec2(uvX, height01)).r;
// }


// float optical_depth_c(Ray current, float rayLength) {
//   vec3 endPoint = current.origin + current.dir * rayLength;
//   float d = dot(current.dir, normalize(current.origin - atmPos));
//   float opticalDepth = 0.;

//   const float blendStrength = 1.5;
//   float w = clamp(d * blendStrength + .5, 0., 1.);

//   float d1 = opticalDepthBaked(current.origin, current.dir) - opticalDepthBaked(endPoint, current.dir);
//   float d2 = opticalDepthBaked(endPoint, -current.dir) - opticalDepthBaked(current.origin, -current.dir);

//   opticalDepth = mix(d2, d1, w);
//   return opticalDepth;
// }


// float optical_depth_c(Ray current, float rayLen) {
//   // determine whether ray passes through planet
//   vec3 endRayPos = current.origin + current.dir * rayLen;
//   float endHeight = length(endRayPos - atmPos) - planetR;
//   float endHeight01 = endHeight / (atmR - planetR);

//   if (abs(endHeight01) < .0001) { // it goes through, reverse ray direction!
//     current.dir = -current.dir;
//     current.origin = endRayPos;
//   }

//   // optimized
//   float firstHeight = length(current.origin - atmPos) - planetR;
//   float firstHeight01 = firstHeight / (atmR - planetR);
//   float firstAngle01 = dot(normalize(atmPos - current.origin), current.dir) * .5 + .5; // 0 when looking up
//   float firstDepth = texture2D(opticalTxt, vec2(firstAngle01, firstHeight01)).r;

//   vec3 endPos = current.origin + current.dir * rayLen;
//   float secondHeight = length(endPos - atmPos) - planetR;
//   float secondHeight01 = secondHeight / (atmR - planetR);
//   float secondAngle01 = dot(normalize(atmPos - endPos), current.dir) * .5 + .5;
//   float secondDepth = texture2D(opticalTxt, vec2(secondAngle01, secondHeight01)).r;
//   return firstDepth - secondDepth;
// }


float optical_depth(Ray current, float rayLen) {
  // credit to Sebastian Lague at https://www.youtube.com/watch?v=DxfEbulyFcY&t=154s

  // unoptimized
  float floatSteps = float(opticalDepthSteps);
  vec3 densitySamplePoint = current.origin;
  float stepSize = rayLen / (floatSteps - 1.);
  float opticalDepth = 0.;

  for (int i = 0; i < opticalDepthSteps; ++i) {
    float localDensity = density_at_point(densitySamplePoint);
    opticalDepth += localDensity * stepSize;
    densitySamplePoint += current.dir * stepSize;
  }

  return opticalDepth;


  // optimized
  // float firstHeight = length(atmPos - current.origin) - planetR;
  // float firstHeight01 = firstHeight / (atmR - planetR);
  // float firstAngle01 = dot(normalize(atmPos - current.origin), current.dir) * .5 + .5;
  // float firstDepth = texture2D(opticalTxt, vec2(firstAngle01, firstHeight01)).r;

  // vec3 endPos = current.origin + current.dir * rayLen;
  // float secondHeight = length(atmPos - endPos) - planetR;
  // float secondHeight01 = secondHeight / (atmR - planetR);
  // float secondAngle01 = dot(normalize(atmPos - endPos), current.dir) * .5 + .5;
  // float secondDepth = texture2D(opticalTxt, vec2(secondAngle01, secondHeight01)).r;
  // return firstDepth - secondDepth;


  // vec3 endPoint = current.origin + current.dir * rayLen;
  // float d = dot(current.dir, normalize(current.origin - atmPos));
  // float opticalDepth = 0.;

  // const float blendStrength = 1.5;
  // float w = clamp(d * blendStrength + .5, 0., 1.);
  
  // float d1 = opticalDepthBaked(current.origin, current.dir) - opticalDepthBaked(endPoint, current.dir);
  // float d2 = opticalDepthBaked(endPoint, -current.dir) - opticalDepthBaked(current.origin, -current.dir);

  // opticalDepth = mix(d2, d1, w);
  // return opticalDepth;
}


vec3 calculate_light(Ray current, float atmDist, float realAtmLen, vec3 rawColor) {
  // credit to Sebastian Lague at https://www.youtube.com/watch?v=DxfEbulyFcY&t=154s

  float floatSteps = float(numScatterPoints);
  vec3 inScatteredLight = vec3(0.);
  float viewOpticalDepth = 0.;

  vec3 sphereEnter = current.origin + atmDist * current.dir;
  vec3 stepVec = current.dir * realAtmLen / (floatSteps - 1.);
  for (int i = 0; i < numScatterPoints; ++i) {
    vec3 scatterPoint = sphereEnter;

    Ray scatterPtToLight;
    scatterPtToLight.origin = scatterPoint;
    scatterPtToLight.dir = normalize(lightPos - scatterPoint);
    float sunRayLength = pierce_atm(scatterPtToLight)[1];

    float sunOpticalDepth = optical_depth(scatterPtToLight, sunRayLength);
    // float sunOpticalDepth_c = optical_depth_c(scatterPtToLight, sunRayLength);
    // if (i == numScatterPoints / 2) {
    //   return vec3(abs(sunOpticalDepth_c - sunOpticalDepth)); // candidate is bigger
    // }


    Ray viewRay;
    viewRay.origin = scatterPoint;
    viewRay.dir = -current.dir;
    viewOpticalDepth = optical_depth(viewRay, length(stepVec));
    // float viewOpticalDepth_c = optical_depth_c(viewRay, length(stepVec));
    // if (i == numScatterPoints / 2) {
    //   return vec3(abs(viewOpticalDepth_c - viewOpticalDepth)); // candidate is bigger
    // }

    vec3 scatterCoefs = vec3(
      pow(400. / wavelengths[0], 4.) * scatteringStrength,
      pow(400. / wavelengths[1], 4.) * scatteringStrength,
      pow(400. / wavelengths[2], 4.) * scatteringStrength
    );

    vec3 transmittance = exp(-(sunOpticalDepth + viewOpticalDepth) * scatterCoefs);
    float localDensity = density_at_point(scatterPoint);

    inScatteredLight += localDensity * transmittance * scatterCoefs * length(stepVec);
    sphereEnter += stepVec;
  }
  float originalColTransmittance = exp(-viewOpticalDepth);

  return rawColor * originalColTransmittance + inScatteredLight;
}


void main() {
  Ray current = create_screen_ray();
  float realDepth = world_depth(vUv);
  vec2 atmDistLen = pierce_atm(current);
  float realAtmLen = min(atmDistLen[1], realDepth - atmDistLen[0]);

  vec4 rawColor = texture2D(colorTxt, vUv);

  if (atmDistLen[1] != 0.) {
    if (realDepth > 1000. && length(rawColor) > 1.) {
      rawColor = vec4(1., 0., 0., 0.);
    }

    vec3 light = calculate_light(current, atmDistLen[0], realAtmLen, rawColor.rgb);
    gl_FragColor = vec4(light, 1.);
  } else {
    gl_FragColor = vec4(rawColor);
  }

  // gl_FragColor = vec4(smoothOptical(vUv), 0., 0., 1.);
  // gl_FragColor = vec4(texture2D(opticalTxt, vUv).rgb, 1.);
}