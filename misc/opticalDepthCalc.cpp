#include <iostream>
#include <cmath>
#include <fstream>
#include <string>
#include <bitset>
using namespace std;

const int opticalDepthSteps = 10;
const float planetR = 1.F;
const float atmR = 2.F;
const float densityFalloff = 12.F;
const int resolution = 250;


struct Ray {
    float origin[3];
    float dir[3];
};


void print(float a[3]) {
    printf("[%.2f, %.2f, %.2f]\n", a[0], a[1], a[2]);
}


float length(float a[3]) {
    return sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}


float dot(float a[3], float b[3]) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}


float density_at_point(float point[3]) {
  // credit to Sebastian Lague at https://www.youtube.com/watch?v=DxfEbulyFcY&t=154s

  float heightAboveSurface = length(point) - planetR;
  float height01 = heightAboveSurface / (atmR - planetR);
  float localDensity = exp(-height01 * densityFalloff) * (1. - height01);
  return localDensity;
}


float dst_through_atm(Ray current) {
    float originDiff[3] = {
        current.origin[0],
        current.origin[1],
        current.origin[2]
    };

    float b = 2.F * dot(originDiff, current.dir);
    float c = dot(originDiff, originDiff) - atmR * atmR;
    float discriminant = b * b - 4.F * c;
    
    return (-b + sqrt(discriminant)) / 2.F;
}


float get_optical_depth(Ray current) {
  float densitySamplePoint[3] = {current.origin[0], current.origin[1], current.origin[2]};
  float stepLen = dst_through_atm(current) / (opticalDepthSteps - 1);
  float opticalDepth = 0.;

  for (int i = 0; i < opticalDepthSteps; ++i) {
    float localDensity = density_at_point(densitySamplePoint);
    opticalDepth += localDensity * stepLen;
    densitySamplePoint[0] += current.dir[0] * stepLen;
    densitySamplePoint[1] += current.dir[1] * stepLen;
    densitySamplePoint[2] += current.dir[2] * stepLen;
  }

  return opticalDepth;
}


int main() {
    // assuming planet at atm centered at [0, 0, 0]
    // start on surface and work up to edge of atm

    // float writtenFloats[resolution][resolution];

    ofstream fout("opticalDepth.bin", ios::binary);

    const float PI = 3.141592;
    float angle = PI / 2.F;
    Ray current = {{0.F, planetR, 0.F}, {cos(angle), sin(angle), 0.F}};

    float posStep = (atmR - planetR) / (resolution - 1);
    float angleStep = PI / (resolution - 1);
    for (int i = 0; i < resolution; ++i) {
        // float rowData[resolution];

        for (int j = 0; j < resolution; ++j) {
            float opticalDepth = get_optical_depth(current);
            fout << opticalDepth << endl;
            // rowData[j] = opticalDepth;

            angle -= angleStep;
            current.dir[0] = cos(angle);
            current.dir[1] = sin(angle);
        }

        current.origin[1] += posStep;
        angle = PI / 2.F;
        current.dir[0] = cos(angle);
        current.dir[1] = sin(angle);

        // fout.write((const char *) rowData, resolution * 4);
        // memcpy(writtenFloats[i], rowData, resolution * 4);
    }

    fout.close();

    // Double-check size of file

    // float readFloats[resolution][resolution];
    // ifstream fin("opticalDepth.bin", ios::binary);
    // fin.seekg(0, fin.end);
    // int len = fin.tellg();
    // fin.seekg(0, fin.beg);
    // cout << len << endl;

    // for (int i = 0; i < resolution; ++i) {
    //     char rawBytes[resolution * 4];
    //     fin.read(rawBytes, resolution * 4);
        
    //     memcpy(readFloats[i], rawBytes, resolution * 4);
    // }

    // // Print the matches
    // bool isMatch = true;
    // for (int i = 0; i < resolution; ++i) {
    //     for (int j = 0; j < resolution; ++j) {
    //         // cout << endl;
    //         // printf("[%d][%d]: written = ", i, j);
    //         // cout << bitset<32>(* (int *) &writtenFloats[i][j] ) << endl;
    //         // printf("[%d][%d]: read    = ", i, j);
    //         // cout << bitset<32>(* (int *) &readFloats[i][j]) << endl;

    //         // printf("[%d][%d]: written = %f\n", i, j, writtenFloats[i][j]);
    //         // printf("[%d][%d]: read = %f\n", i, j, readFloats[i][j]);

    //         if (writtenFloats[i][j] != readFloats[i][j]) {
    //             isMatch = false;
    //         }
    //     }
    // }

    // if (isMatch) {
    //     cout << "\nThe two are equal!\n" << endl;
    // } else {
    //     cout << "\nThese aren't equal.\n" << endl;
    // }
}


// C:\Users\evana\Documents\MyPrograms\WebDev\React\HomePages\misc
// view PFM files here:
// https://imagetostl.com/view-pfm-online