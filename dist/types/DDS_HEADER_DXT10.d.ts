export default interface DDS_HEADER_DXT10 {
    dxgiFormat: number;
    resourceDimension: number;
    miscFlag: {
        DDS_RESOURCE_MISC_TEXTURECUBE: boolean;
    };
    arraySize: number;
    miscFlags2: {
        DDS_ALPHA_MODE_UNKNOWN: boolean;
        DDS_ALPHA_MODE_STRAIGHT: boolean;
        DDS_ALPHA_MODE_PREMULTIPLIED: boolean;
        DDS_ALPHA_MODE_OPAQUE: boolean;
        DDS_ALPHA_MODE_CUSTOM: boolean;
    };
}
