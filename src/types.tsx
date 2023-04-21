enum ObjectDetectionObjectType {
  COVID_19_VACCINATION_CARD_0 = 'COVID_19_VACCINATION_CARD_0',
  COVID_19_VACCINATION_CARD_0_BACK = 'COVID_19_VACCINATION_CARD_0_BACK',
  COVID_19_VACCINATION_CARD_1 = 'COVID_19_VACCINATION_CARD_1',
  COVID_19_VACCINATION_CARD_1_BACK = 'COVID_19_VACCINATION_CARD_1_BACK',
  DRIVER_LICENSE_0 = 'DRIVER_LICENSE_0',
  DRIVER_LICENSE_0_BACK = 'DRIVER_LICENSE_0_BACK',
  DRIVER_LICENSE_1 = 'DRIVER_LICENSE_1',
  DRIVER_LICENSE_1_BACK = 'DRIVER_LICENSE_1_BACK',
  LICENSE_PLATE_0_0 = 'LICENSE_PLATE_0_0',
  LICENSE_PLATE_0_1 = 'LICENSE_PLATE_0_1',
  LICENSE_PLATE_1_0 = 'LICENSE_PLATE_1_0',
  LICENSE_PLATE_2_0 = 'LICENSE_PLATE_2_0',
  LICENSE_PLATE_3_0 = 'LICENSE_PLATE_3_0',
  LICENSE_PLATE_3_1 = 'LICENSE_PLATE_3_1',
  NATIONAL_ID_0 = 'NATIONAL_ID_0',
  NATIONAL_ID_0_BACK = 'NATIONAL_ID_0_BACK',
  NATIONAL_ID_1 = 'NATIONAL_ID_1',
  NATIONAL_ID_1_BACK = 'NATIONAL_ID_1_BACK',
  NATIONAL_ID_2 = 'NATIONAL_ID_2',
  NATIONAL_ID_2_BACK = 'NATIONAL_ID_2_BACK',
  PASSPORT_0 = 'PASSPORT_0',
  PASSPORT_0_TOP = 'PASSPORT_0_TOP',
  SUPERFIT_0 = 'SUPERFIT_0',
  SUPERFIT_0_BACK = 'SUPERFIT_0_BACK',
  VEHICLE_REGISTRATION_0 = 'VEHICLE_REGISTRATION_0',
  VEHICLE_REGISTRATION_0_BACK = 'VEHICLE_REGISTRATION_0_BACK',
  VEHICLE_REGISTRATION_1 = 'VEHICLE_REGISTRATION_1',
  VEHICLE_REGISTRATION_1_BACK = 'VEHICLE_REGISTRATION_1_BACK',
  VEHICLE_REGISTRATION_2 = 'VEHICLE_REGISTRATION_2',
}

enum ObjectDetectionObjectGroup {
  COVID_19_VACCINATION_CARD = 'COVID_19_VACCINATION_CARD',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  DRIVER_LICENSE_FRONT = 'DRIVER_LICENSE_FRONT',
  DRIVER_LICENSE_BACK = 'DRIVER_LICENSE_BACK',
  LICENSE_PLATE = 'LICENSE_PLATE',
  NATIONAL_ID = 'NATIONAL_ID',
  NATIONAL_ID_FRONT = 'NATIONAL_ID_FRONT',
  NATIONAL_ID_BACK = 'NATIONAL_ID_BACK',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  VEHICLE_REGISTRATION_FRONT = 'VEHICLE_REGISTRATION_FRONT',
  VEHICLE_REGISTRATION_BACK = 'VEHICLE_REGISTRATION_BACK',
  PASSPORT = 'PASSPORT',
  PASSPORT_TOP = 'PASSPORT_TOP',
  PASSPORT_BOTTOM = 'PASSPORT_BOTTOM',
  OTHERS = 'OTHERS',
}

enum LivenessPromptType {
  BLINKING = 'BLINKING',
  LOOK_LEFT = 'LOOK_LEFT',
  LOOK_RIGHT = 'LOOK_RIGH',
}

enum FaceDetectionEyesStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

enum FaceDetectionHeadDirection {
  FRONT = 'FRONT',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

enum EkycIDLanguage {
  EN = 'EN',
  KH = 'KH',
}

type ScannableDocument = {
  mainSide: ObjectDetectionObjectType;
  secondarySide?: ObjectDetectionObjectType | null;
};

type DocumentScannerCameraOptions = {
  preparingDuration: number;
};

type DocumentScannerScannerOptions = {
  cameraOptions: DocumentScannerCameraOptions;
  scannableDocuments: [ScannableDocument];
};

type DocumentScannerOverlayOptions = {
  language: EkycIDLanguage;
};

type LivenessDetectionCameraOptions = {
  prompts: [LivenessPromptType, LivenessPromptType, LivenessPromptType];
  promptTimerCountDownSec: number;
};

type LivenessDetectionScannerOptions = {
  options: LivenessDetectionCameraOptions;
};

type LivenessDetectionOverlayOptions = {
  language: EkycIDLanguage;
};

type DocumentScannerResult = {
  documentImage: string;
  documentGroup: ObjectDetectionObjectGroup;
  documentType: ObjectDetectionObjectType;
  fullImage: string;
  faceImage: string | null;
};

type LivenessPrompt = {
  prompt: LivenessPromptType;
  success: boolean | null;
};

type LivenessFace = {
  image: string | null;
  leftEyeOpenProbability: number | null;
  rightEyeOpenProbability: number | null;
  headEulerAngleX: number | null;
  headEulerAngleY: number | null;
  headEulerAngleZ: number | null;
  headDirection: FaceDetectionHeadDirection | null;
  eyesStatus: FaceDetectionEyesStatus | null;
};

type LivenessDetectionResult = {
  prompts: [LivenessPrompt];
  frontFace: LivenessFace | null;
  leftFace: LivenessFace | null;
  rightFace: LivenessFace | null;
};

export {
  ObjectDetectionObjectType,
  ObjectDetectionObjectGroup,
  LivenessPromptType,
  FaceDetectionEyesStatus,
  FaceDetectionHeadDirection,
  EkycIDLanguage,
  ScannableDocument,
  DocumentScannerCameraOptions,
  DocumentScannerScannerOptions,
  DocumentScannerOverlayOptions,
  LivenessDetectionCameraOptions,
  LivenessDetectionScannerOptions,
  LivenessDetectionOverlayOptions,
  DocumentScannerResult,
  LivenessPrompt,
  LivenessFace,
  LivenessDetectionResult,
};
