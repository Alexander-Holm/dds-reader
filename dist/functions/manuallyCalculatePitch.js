import { DXGI_FORMAT } from "../enums/DXGI_FORMAT.js";
import { FOUR_CC } from "../enums/FOUR_CC.js";
// Microsoft recommends manually calculating pitch
// https://learn.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide
/*
    we recommend that you compute the pitch in one of the following ways for the indicated formats:

  * For block-compressed formats, compute the pitch as:
    max( 1, ((width+3)/4) ) * block-size
    The block-size is 8 bytes for DXT1, BC1, and BC4 formats, and 16 bytes for other block-compressed formats.
    
  * For R8G8_B8G8, G8R8_G8B8, legacy UYVY-packed, and legacy YUY2-packed formats, compute the pitch as:
    ((width+1) >> 1) * 4

  * For other formats, compute the pitch as:
    ( width * bits-per-pixel + 7 ) / 8
    You divide by 8 for byte alignment.
*/
// Using Math.floor() because division should be done with integers
export default function manuallyCalculatePitch(blockSize, width, bitsPerPixel, fourCC, dxgiFormat) {
    if (blockSize === undefined)
        blockSize = getBlockSize(fourCC, dxgiFormat);
    const isBlockCompressed = blockSize > 0;
    if (isBlockCompressed)
        return Math.floor((width + 3) / 4) * blockSize;
    else if (isLegacyPacked(fourCC, dxgiFormat))
        return ((width + 1) >> 1) * 4;
    else
        return Math.floor((width * bitsPerPixel + 7) / 8);
}
function isLegacyPacked(fourCC, dxgiFormat) {
    switch (fourCC) {
        case FOUR_CC.R8G8_B8G8:
        case FOUR_CC.G8R8_G8B8:
            return true;
    }
    switch (dxgiFormat) {
        case DXGI_FORMAT.R8G8_B8G8_UNORM:
        case DXGI_FORMAT.G8R8_G8B8_UNORM:
        case DXGI_FORMAT.YUY2:
            return true;
    }
    return false;
}
function getBlockSize(fourCC, dxgiFormat) {
    let blockSize = 0;
    switch (fourCC) {
        case FOUR_CC.DX10:
            switch (dxgiFormat) {
                case DXGI_FORMAT.BC1_TYPELESS:
                case DXGI_FORMAT.BC1_UNORM:
                case DXGI_FORMAT.BC1_UNORM_SRGB:
                case DXGI_FORMAT.BC4_TYPELESS:
                case DXGI_FORMAT.BC4_UNORM:
                case DXGI_FORMAT.BC4_SNORM:
                    blockSize = 8;
                    break;
                case DXGI_FORMAT.BC2_TYPELESS:
                case DXGI_FORMAT.BC2_UNORM:
                case DXGI_FORMAT.BC2_UNORM_SRGB:
                case DXGI_FORMAT.BC3_TYPELESS:
                case DXGI_FORMAT.BC3_UNORM:
                case DXGI_FORMAT.BC3_UNORM_SRGB:
                case DXGI_FORMAT.BC5_TYPELESS:
                case DXGI_FORMAT.BC5_UNORM:
                case DXGI_FORMAT.BC5_SNORM:
                case DXGI_FORMAT.BC6H_TYPELESS:
                case DXGI_FORMAT.BC6H_UF16:
                case DXGI_FORMAT.BC6H_SF16:
                case DXGI_FORMAT.BC7_TYPELESS:
                case DXGI_FORMAT.BC7_UNORM:
                case DXGI_FORMAT.BC7_UNORM_SRGB:
                    blockSize = 16;
                    break;
            }
            break;
        case FOUR_CC.DXT1: // BC1
        case FOUR_CC.ATI1: // BC4
            blockSize = 8;
            break;
        case FOUR_CC.DXT2: // BC2
        case FOUR_CC.DXT3: // BC2
        case FOUR_CC.DXT4: // BC3
        case FOUR_CC.DXT5: // BC3
        case FOUR_CC.ATI2: // BC5
            blockSize = 16;
            break;
    }
    return blockSize;
}
