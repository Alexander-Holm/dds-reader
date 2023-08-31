import isFlagSet from "./functions/isFlagSet.js";
import manuallyCalculatePitch from "./functions/manuallyCalculatePitch.js";
import { FOUR_CC } from "./enums/FOUR_CC.js";
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
export default function readDDS(byteArray, calculatePitch = true, blockSize) {
    var _a;
    const minimumFileSize = 128; // bytes
    if (byteArray.byteLength < minimumFileSize)
        throw new Error("File size is smaller than the minimum size of a .dds file (128 bytes).");
    // Offset to bdata without dxt10 header,
    // adjusted by +20 if dxt10 header is present
    let bdataOffset = minimumFileSize;
    // dwMagic and header (without header10, bdata, or bdata2)
    const metaData = new Uint32Array(byteArray, 0, 32);
    // First uint32 should contain the four character code value 'DDS ' (hexadecimal 0x20534444).
    if (metaData[0] !== FOUR_CC.DDS)
        throw new Error("The first four bytes of the file does not contain the four character code value 'DDS ' (hexadecimal 0x20534444).");
    let i = 0;
    // DDS File Layout
    // https://learn.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide
    const ddsFileLayout = {
        dwMagic: metaData[i++],
        // DDS_HEADER structure
        // https://learn.microsoft.com/en-us/windows/win32/direct3ddds/dds-header
        header: {
            dwSize: metaData[i++],
            dwFlags: {
                DDSD_CAPS: isFlagSet(metaData[i], 0x1),
                DDSD_HEIGHT: isFlagSet(metaData[i], 0x2),
                DDSD_WIDTH: isFlagSet(metaData[i], 0x4),
                DDSD_PITCH: isFlagSet(metaData[i], 0x8),
                DDSD_PIXELFORMAT: isFlagSet(metaData[i], 0x1000),
                DDSD_MIPMAPCOUNT: isFlagSet(metaData[i], 0x20000),
                DDSD_LINEARSIZE: isFlagSet(metaData[i], 0x80000),
                DDSD_DEPTH: isFlagSet(metaData[i++], 0x800000),
            },
            dwHeight: metaData[i++],
            dwWidth: metaData[i++],
            // May be manually calculated later
            dwPitchOrLinearSize: metaData[i++],
            dwDepth: metaData[i++],
            dwMipMapCount: metaData[i++],
            dwReserved1: metaData.slice(i, (i = i + 11)),
            // DDS_PIXELFORMAT structure
            // https://learn.microsoft.com/en-us/windows/win32/direct3ddds/dds-pixelformat     
            ddspf: {
                ddwSize: metaData[i++],
                dwFlags: {
                    DDPF_ALPHAPIXELS: isFlagSet(metaData[i], 0x1),
                    DDPF_ALPHA: isFlagSet(metaData[i], 0x2),
                    DDPF_FOURCC: isFlagSet(metaData[i], 0x4),
                    DDPF_RGB: isFlagSet(metaData[i], 0x40),
                    DDPF_YUV: isFlagSet(metaData[i], 0x200),
                    DDPF_LUMINANCE: isFlagSet(metaData[i++], 0x20000),
                },
                dwFourCC: metaData[i++],
                dwRGBBitCount: metaData[i++],
                dwRBitMask: metaData[i++],
                dwGBitMask: metaData[i++],
                dwBBitMask: metaData[i++],
                dwABitMask: metaData[i++],
            },
            dwCaps: {
                DDSCAPS_COMPLEX: isFlagSet(metaData[i], 0x8),
                DDSCAPS_MIPMAP: isFlagSet(metaData[i], 0x400000),
                DDSCAPS_TEXTURE: isFlagSet(metaData[i++], 0x1000),
            },
            dwCaps2: {
                DDSCAPS2_CUBEMAP: isFlagSet(metaData[i], 0x200),
                DDSCAPS2_CUBEMAP_POSITIVEX: isFlagSet(metaData[i], 0x400),
                DDSCAPS2_CUBEMAP_NEGATIVEX: isFlagSet(metaData[i], 0x800),
                DDSCAPS2_CUBEMAP_POSITIVEY: isFlagSet(metaData[i], 0x1000),
                DDSCAPS2_CUBEMAP_NEGATIVEY: isFlagSet(metaData[i], 0x2000),
                DDSCAPS2_CUBEMAP_POSITIVEZ: isFlagSet(metaData[i], 0x4000),
                DDSCAPS2_CUBEMAP_NEGATIVEZ: isFlagSet(metaData[i], 0x8000),
                DDSCAPS2_VOLUME: isFlagSet(metaData[i++], 0x200000),
            },
            dwCaps3: metaData[i++],
            dwCaps4: metaData[i++],
            dwReserved2: metaData[i++],
        },
        // Set later
        header10: null,
        bdata: null,
        bdata2: null,
    };
    // Add dxt10 header if it exists
    if (ddsFileLayout.header.ddspf.dwFlags.DDPF_FOURCC &&
        ddsFileLayout.header.ddspf.dwFourCC == FOUR_CC.DX10) {
        const header10 = {
            // dxt10 header sits after the normal header where bdata array would be
            offset: bdataOffset,
            size: 20,
            // Check first to see if the file is big enough to contain the header10
            data: new Uint32Array(0)
        };
        // bdata comes after header10
        bdataOffset += header10.size;
        if (byteArray.byteLength < bdataOffset)
            throw new Error("Header includes the fourCC code 'DX10' but the file is not big enough to contain a 20 byte DDS_HEADER_DXT10.");
        i = 0;
        header10.data = new Uint32Array(byteArray, header10.offset, 5);
        // DDS_HEADER_DXT10 structure
        // https://learn.microsoft.com/en-us/windows/win32/direct3ddds/dds-header-dxt10
        ddsFileLayout.header10 = {
            dxgiFormat: header10.data[i++],
            resourceDimension: header10.data[i++],
            miscFlag: {
                DDS_RESOURCE_MISC_TEXTURECUBE: isFlagSet(header10.data[i++], 0x4)
            },
            arraySize: header10.data[i++],
            miscFlags2: {
                DDS_ALPHA_MODE_UNKNOWN: isFlagSet(header10.data[i], 0x0),
                DDS_ALPHA_MODE_STRAIGHT: isFlagSet(header10.data[i], 0x1),
                DDS_ALPHA_MODE_PREMULTIPLIED: isFlagSet(header10.data[i], 0x2),
                DDS_ALPHA_MODE_OPAQUE: isFlagSet(header10.data[i], 0x3),
                DDS_ALPHA_MODE_CUSTOM: isFlagSet(header10.data[i++], 0x4),
            },
        };
    }
    let bdataSize; // bytes
    if (ddsFileLayout.header.dwFlags.DDSD_LINEARSIZE)
        bdataSize = ddsFileLayout.header.dwPitchOrLinearSize;
    else if (ddsFileLayout.header.dwFlags.DDSD_PITCH && !calculatePitch)
        bdataSize = ddsFileLayout.header.dwPitchOrLinearSize * ddsFileLayout.header.dwHeight;
    else {
        const pitch = manuallyCalculatePitch(blockSize, ddsFileLayout.header.dwWidth, ddsFileLayout.header.ddspf.dwRGBBitCount, ddsFileLayout.header.ddspf.dwFourCC, (_a = ddsFileLayout.header10) === null || _a === void 0 ? void 0 : _a.dxgiFormat);
        if (pitch <= 0) {
            const message = "Pitch could not be manually calculated.\n" +
                "Without pitch the size of bdata can not be determined.\n" +
                "You can try calling the function with the calculatePitch parameter set to false or using the blockSize parameter.";
            throw new Error(message);
        }
        bdataSize = pitch * ddsFileLayout.header.dwHeight;
    }
    ddsFileLayout.bdata = byteArray.slice(bdataOffset, bdataOffset + bdataSize);
    ddsFileLayout.bdata2 = byteArray.slice(bdataOffset + bdataSize);
    return ddsFileLayout;
}
