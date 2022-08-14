import { NativeModules } from 'react-native';

const EkycIDNative = NativeModules.EkycID;

class EkycIDWrapper {
    startDocumentScanner = async () => {
        const nativeResults = await EkycIDNative.startDocumentScanner();
        console.log(nativeResults);
    }

    startLivenessDetection = async () => {
        const nativeResults = await EkycIDNative.startLivenessDetection();
        console.log(nativeResults);
    }

    startEkycIDExpress = async () => {
        const nativeResults = await EkycIDNative.startEkycIDExpress();
        console.log(nativeResults);
    }
}

export var EkycID = new EkycIDWrapper();