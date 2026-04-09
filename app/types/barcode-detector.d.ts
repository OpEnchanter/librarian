export {};

declare global {
  type BarcodeFormat =
    | "aztec"
    | "code_128"
    | "code_39"
    | "code_93"
    | "codabar"
    | "data_matrix"
    | "ean_13"
    | "ean_8"
    | "itf"
    | "pdf417"
    | "qr_code"
    | "upc_a"
    | "upc_e";

  interface BarcodeDetectorOptions {
    formats?: BarcodeFormat[];
  }

  interface DetectedBarcode {
    boundingBox: DOMRectReadOnly;
    rawValue: string;
    format: BarcodeFormat;
    cornerPoints: { x: number; y: number }[];
  }

  interface BarcodeDetector {
    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
  }

  var BarcodeDetector: {
    prototype: BarcodeDetector;
    new (options?: BarcodeDetectorOptions): BarcodeDetector;
    getSupportedFormats?(): Promise<BarcodeFormat[]>;
  };
}
