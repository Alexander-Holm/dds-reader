import DDS_FILE_LAYOUT from "./types/DDS_FILE_LAYOUT.js";
import DDS_HEADER, { DDS_PIXELFORMAT } from "./types/DDS_HEADER.js";
import DDS_HEADER_DXT10 from "./types/DDS_HEADER_DXT10.js";
import { FOUR_CC } from "./enums/FOUR_CC.js";
import { DXGI_FORMAT } from "./enums/DXGI_FORMAT.js";
/**
 * Returns an object with the structure described in the
 * {@link https://learn.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide | DDS file specification}.
 * Flags are represented as objects containing named booleans,
 * {@link DDS_HEADER | see DDS_HEADER}.
 *
 * @param byteArray -
 * The .dds file as an ArrayBuffer
 *
 * @param calculatePitch -
 * Microsoft recommends calculating the pitch manually
 * instead of reading it from the file,
 * {@link https://learn.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide | see link}.
 *
 * Set to false to read pitch directly from the file.
 *
 * @param blockSize -
 * Manually set the block size that will be used when calculating pitch.
 * Use this if pitch is not being calculated correctly and you know the
 * {@link https://learn.microsoft.com/en-us/windows/win32/direct3d11/texture-block-compression-in-direct3d-11 | block compression format}.
 *
 * By default the block size is inferred from the values in {@link DDS_PIXELFORMAT.dwFourCC} and {@link DDS_HEADER_DXT10.dxgiFormat}.
 * See the files {@link FOUR_CC} and {@link DXGI_FORMAT} for what values the block size can be automatically determined.
 */
export default function readDDS(byteArray: ArrayBuffer, calculatePitch?: boolean, blockSize?: number): DDS_FILE_LAYOUT;
