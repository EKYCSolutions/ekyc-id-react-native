import type { ObjectDetectionObjectType, ObjectDetectionObjectGroup } from './DocumentScannerValues';

export interface DocumentScannerResult {
    documentType: ObjectDetectionObjectType;
    documentGroup: ObjectDetectionObjectGroup;
    fullImage: String;
    documentImage: String;
    faceImage?: String;
}