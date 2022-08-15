import { NativeModules } from 'react-native';
import type {
    DocumentScannerOverlayOptions,
    DocumentScannerResult,
    DocumentScannerScannerOptions,
    LivenessDetectionOverlayOptions,
    LivenessDetectionResult,
    LivenessDetectionScannerOptions
} from './types';

const EkycIDNative = NativeModules.EkycID;

type DocumentScannerResponse = {
    mainSide: DocumentScannerResult,
    secondarySide: DocumentScannerResult | null
}

type LivenessDetectionResponse = {
    result: LivenessDetectionResult,
}

type EkycIDExpressResponse = {
    mainSide: DocumentScannerResult,
    secondarySide: DocumentScannerResult | null,
    liveness: LivenessDetectionResult,
}

class EkycIDWrapper {
    startDocumentScanner = async (
        scannerOptions?: DocumentScannerScannerOptions | null,
        overlayOptions?: DocumentScannerOverlayOptions | null
    ): Promise<DocumentScannerResponse> => {
        return await EkycIDNative.startDocumentScanner(scannerOptions, overlayOptions);
    }

    startLivenessDetection = async (
        scannerOptions?: LivenessDetectionScannerOptions | null,
        overlayOptions?: LivenessDetectionOverlayOptions | null
    ): Promise<LivenessDetectionResponse> => {
        return await EkycIDNative.startLivenessDetection(scannerOptions, overlayOptions);
    }

    startEkycIDExpress = async (
        documentScannerScannerOptions?: DocumentScannerScannerOptions | null,
        documentScannerOverlayOptions?: DocumentScannerOverlayOptions | null,
        livenessDetectionScannerOptions?: LivenessDetectionScannerOptions | null,
        livenessDetectionOverlayOptions?: LivenessDetectionOverlayOptions | null,
    ): Promise<EkycIDExpressResponse> => {
        return await EkycIDNative.startEkycIDExpress(
            documentScannerScannerOptions,
            documentScannerOverlayOptions,
            livenessDetectionScannerOptions,
            livenessDetectionOverlayOptions,
        );
    }
}

var EkycID = new EkycIDWrapper();

export { EkycID }