import { NativeModules } from 'react-native';

const EkycIDNative = NativeModules.EkycID;

class EkycIDWrapper {
    startDocumentScanner = async () => { }
}

export var EkycID = new EkycIDWrapper();