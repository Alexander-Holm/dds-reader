import type DDS_HEADER from "./DDS_HEADER";
import type DDS_HEADER_DXT10 from "./DDS_HEADER_DXT10";
export default interface DDS_FILE_LAYOUT {
    dwMagic: number;
    header: DDS_HEADER;
    header10: DDS_HEADER_DXT10 | null;
    bdata: ArrayBuffer | null;
    bdata2: ArrayBuffer | null;
}
