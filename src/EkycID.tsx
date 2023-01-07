import { NativeModules, Platform } from 'react-native';
import type {
    DocumentScannerOverlayOptions,
    DocumentScannerResult,
    DocumentScannerScannerOptions,
    LivenessDetectionOverlayOptions,
    LivenessDetectionResult,
    LivenessDetectionScannerOptions,
} from './types';

const EkycIDNative = Platform.select({
    ios: NativeModules.EkycIDModule,
    android: NativeModules.EkycID,
});

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

        const nativeResponse = await EkycIDNative.startDocumentScanner(scannerOptions, {});

        if (Platform.OS == 'ios') {
            return {
                "mainSide": nativeResponse[0],
                "secondarySide": nativeResponse.length == 2 ? nativeResponse[1] : null,
            };
        }

        return nativeResponse;
    }

    startLivenessDetection = async (
        scannerOptions?: LivenessDetectionScannerOptions | null,
        overlayOptions?: LivenessDetectionOverlayOptions | null
    ): Promise<LivenessDetectionResponse> => {


        const nativeResponse = await EkycIDNative.startLivenessDetection(scannerOptions, overlayOptions);

        if (Platform.OS == 'ios') {
            return {
                "result": nativeResponse[0]
            }
        }

        return nativeResponse;
    }

    startEkycIDExpress = async (
        documentScannerScannerOptions?: DocumentScannerScannerOptions | null,
        documentScannerOverlayOptions?: DocumentScannerOverlayOptions | null,
        livenessDetectionScannerOptions?: LivenessDetectionScannerOptions | null,
        livenessDetectionOverlayOptions?: LivenessDetectionOverlayOptions | null,
    ): Promise<EkycIDExpressResponse> => {

        const nativeResponse = await EkycIDNative.startEkycIDExpress(
            documentScannerScannerOptions,
            documentScannerOverlayOptions,
            livenessDetectionScannerOptions,
            livenessDetectionOverlayOptions,
        );

        if (Platform.OS == 'ios') {
            return {
                "mainSide": nativeResponse[0],
                "secondarySide": nativeResponse.length == 3 ? nativeResponse[1] : null,
                "liveness": nativeResponse[2],
            }
        }

        return nativeResponse;
    }
}

var EkycID = new EkycIDWrapper();

export { EkycID }