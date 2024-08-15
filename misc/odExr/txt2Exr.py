import numpy as np
from openexr_numpy import imwrite
import struct

RESOLUTION = 5


def read_bin(fileName: str) -> list[list[float]]:
    '''
    Reads file and returns list of floats.
    '''
    fileContent: bytes
    with open(fileName, mode='rb') as file: # b is important -> binary
        fileContent = file.read()

    floatArr: list[list[float]] = []
    for rowNum in range(RESOLUTION):
        floatArr.append([])

    ctr = 0
    for rowNum in range(RESOLUTION):
        for colNum in range(RESOLUTION):
            floatArr[RESOLUTION - rowNum - 1].append(struct.unpack("f", fileContent[ctr : ctr + 4]))
            ctr += 4

    return floatArr


if __name__ == '__main__':
    rawList = read_bin('opticalDepth.bin')
    print(rawList)
    nparr = np.array(rawList, dtype=np.float32)
    imwrite('opticalDepth.exr', nparr)