export default interface DDS_HEADER {
    dwSize: number;
    dwFlags: {
        DDSD_CAPS: boolean;
        DDSD_HEIGHT: boolean;
        DDSD_WIDTH: boolean;
        DDSD_PITCH: boolean;
        DDSD_PIXELFORMAT: boolean;
        DDSD_MIPMAPCOUNT: boolean;
        DDSD_LINEARSIZE: boolean;
        DDSD_DEPTH: boolean;
    };
    dwHeight: number;
    dwWidth: number;
    dwPitchOrLinearSize: number;
    dwDepth: number;
    dwMipMapCount: number;
    dwReserved1: Uint32Array;
    ddspf: DDS_PIXELFORMAT;
    dwCaps: {
        DDSCAPS_COMPLEX: boolean;
        DDSCAPS_MIPMAP: boolean;
        DDSCAPS_TEXTURE: boolean;
    };
    dwCaps2: {
        DDSCAPS2_CUBEMAP: boolean;
        DDSCAPS2_CUBEMAP_POSITIVEX: boolean;
        DDSCAPS2_CUBEMAP_NEGATIVEX: boolean;
        DDSCAPS2_CUBEMAP_POSITIVEY: boolean;
        DDSCAPS2_CUBEMAP_NEGATIVEY: boolean;
        DDSCAPS2_CUBEMAP_POSITIVEZ: boolean;
        DDSCAPS2_CUBEMAP_NEGATIVEZ: boolean;
        DDSCAPS2_VOLUME: boolean;
    };
    dwCaps3: number;
    dwCaps4: number;
    dwReserved2: number;
}
export interface DDS_PIXELFORMAT {
    ddwSize: number;
    dwFlags: {
        DDPF_ALPHAPIXELS: boolean;
        DDPF_ALPHA: boolean;
        DDPF_FOURCC: boolean;
        DDPF_RGB: boolean;
        DDPF_YUV: boolean;
        DDPF_LUMINANCE: boolean;
    };
    dwFourCC: number;
    dwRGBBitCount: number;
    dwRBitMask: number;
    dwGBitMask: number;
    dwBBitMask: number;
    dwABitMask: number;
}
