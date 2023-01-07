//
//  EkycIDModule.swift
//  ekyc-id-react-native
//
//  Created by Socret Lee on 8/17/22.
//

import AVFoundation
import EkycID
import Foundation
import UIKit

@objc(EkycIDModule)
class EkycIDModule: NSObject, DocumentScannerViewControllerDelegate, LivenessDetectionViewControllerDelegate, EkycIDExpressViewControllerDelegate {
    private var promiseResolver: RCTPromiseResolveBlock?
    private var promiseRejecter: RCTPromiseRejectBlock?
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc func startDocumentScanner(
        _ scannerOptions: NSDictionary?,
        overlayOptions: NSDictionary?,
        resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        self.prepareScanning(resolve, reject)
        
        DispatchQueue.main.async {
            let documentScannerView = DocumentScannerViewController()
            documentScannerView.delegate = self
            documentScannerView.scannerOptions = self.buildDocumentScannerScannerOptions(options: scannerOptions)
            documentScannerView.overlayOptions = self.buildDocumentScannerOverlayOptions(options: overlayOptions)
            print("important", documentScannerView.overlayOptions)
            
            let rootViewController = UIApplication.shared.keyWindow?.rootViewController
            rootViewController?.present(documentScannerView, animated: true)
        }
    }
    
    @objc func startLivenessDetection(
        _ scannerOptions: NSDictionary?,
        overlayOptions: NSDictionary?,
        resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        self.prepareScanning(resolve, reject)
        DispatchQueue.main.async {
            let livenessDetectionView = LivenessDetectionViewController()
            livenessDetectionView.delegate = self
            livenessDetectionView.scannerOptions = self.buildLivenessDetectionScannerOptions(options: scannerOptions)
            livenessDetectionView.overlayOptions = self.buildLivenessDetectionOverlayOptions(options: overlayOptions)

            let rootViewController = UIApplication.shared.keyWindow?.rootViewController
            rootViewController?.present(livenessDetectionView, animated: true)
        }
    }
    
    @objc func startEkycIDExpress(
        _ documentScannerScannerOptions: NSDictionary?,
        documentScannerOverlayOptions: NSDictionary?,
        livenessDetectionScannerOptions: NSDictionary?,
        livenessDetectionOverlayOptions: NSDictionary?,
        resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        self.prepareScanning(resolve, reject)
        
        DispatchQueue.main.async {
            let ekycIDExpressView = EkycIDExpressViewController()
            ekycIDExpressView.delegate = self
            ekycIDExpressView.documentScannerScannerOptions = self.buildDocumentScannerScannerOptions(options: documentScannerScannerOptions)
            ekycIDExpressView.documentScannerOverlayOptions = self.buildDocumentScannerOverlayOptions(options: documentScannerOverlayOptions)
            ekycIDExpressView.livenessDetectionScannerOptions = self.buildLivenessDetectionScannerOptions(options: livenessDetectionScannerOptions)
            ekycIDExpressView.livenessDetectionOverlayOptions = self.buildLivenessDetectionOverlayOptions(options: livenessDetectionOverlayOptions)
            let rootViewController = UIApplication.shared.keyWindow?.rootViewController
            rootViewController?.present(ekycIDExpressView, animated: true)
        }
    }
    
    func onDocumentScannerViewControllerResult(mainSide: DocumentScannerResult, secondarySide: DocumentScannerResult?) {
        var response: NSArray = []
        response = response.adding(mainSide.toDictionary()) as NSArray
        if secondarySide != nil {
            response = response.adding(secondarySide!.toDictionary()) as NSArray
        }
        
        self.promiseResolver!(response)
    }
    
    func onLivenessDetectionViewControllerResult(_ result: LivenessDetectionResult) {
        var response: NSArray = []
        response = response.adding(result.toDictionary()) as NSArray
        self.promiseResolver!(response)
    }
    
    func onEkycIDExpressViewControllerResult(mainSide: DocumentScannerResult, secondarySide: DocumentScannerResult?, liveness: LivenessDetectionResult) {
        var response: NSArray = []
        response = response.adding(mainSide.toDictionary()) as NSArray
        if secondarySide != nil {
            response = response.adding(secondarySide!.toDictionary()) as NSArray
        }
        response = response.adding(liveness.toDictionary()) as NSArray
        self.promiseResolver!(response)
    }
    
    private func prepareScanning(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        self.promiseResolver = resolve
        self.promiseRejecter = reject
    }
    
    private func buildDocumentScannerScannerOptions(options: NSDictionary?) -> DocumentScannerOptions {
        if options == nil {
            return DocumentScannerOptions()
        }
        
        var cameraOptions = DocumentScannerCameraOptions()
        if options!.value(forKey: "cameraOptions") != nil {
            let map = options!.value(forKey: "cameraOptions") as! NSDictionary
            cameraOptions = DocumentScannerCameraOptions(
                preparingDuration: map.value(forKey: "preparingDuration") != nil ? map.value(forKey: "preparingDuration") as! Int : 3
            )
        }
        
        var scannableDocuments: [ScannableDocument] = []
        if options!.value(forKey: "scannableDocuments") != nil {
            let arr: [NSDictionary] = options?.value(forKey: "scannableDocuments") as! [NSDictionary]
            scannableDocuments = arr.map {
                ScannableDocument(
                    mainSide: ObjectDetectionObjectType(rawValue: $0.value(forKey: "mainSide") as! String)!,
                    secondarySide: $0.value(forKey: "secondarySide") != nil ? ObjectDetectionObjectType(rawValue: $0.value(forKey: "secondarySide") as! String) : nil
                )
            }
        }

        return DocumentScannerOptions(
            cameraOptions: cameraOptions,
            scannableDocuments: scannableDocuments
        )
    }
    
    private func buildDocumentScannerOverlayOptions(options: NSDictionary?) -> DocumentScannerOverlayOptions {
        if options == nil {
            return DocumentScannerOverlayOptions()
        }
    
        return DocumentScannerOverlayOptions(
            language: options!.value(forKey: "language") != nil ? EkycIDLanguage(rawValue: options!.value(forKey: "language") as! String)! : .KH
        )
    }
    
    private func buildLivenessDetectionScannerOptions(options: NSDictionary?) -> LivenessDetectionOptions {
        if options == nil {
            return LivenessDetectionOptions()
        }

        print("hello from here")
        
        var cameraOptions = LivenessDetectionCameraOptions()
        
        if options!.value(forKey: "cameraOptions") != nil {
            let map = options!.value(forKey: "cameraOptions") as! NSDictionary
            cameraOptions = LivenessDetectionCameraOptions(
                prompts: map.value(forKey: "prompts") != nil ? (map.value(forKey: "prompts") as! [String]).map {
                    LivenessPromptType(rawValue: $0)!
                } : [.LOOK_LEFT, .LOOK_RIGHT, .BLINKING],
                promptTimerCountDownSec: map.value(forKey: "promptTimerCountDownSec") != nil ? map.value(forKey: "promptTimerCountDownSec") as! Int : 5
            )
        }

        return LivenessDetectionOptions(cameraOptions: cameraOptions)
    }
    
    private func buildLivenessDetectionOverlayOptions(options: NSDictionary?) -> LivenessDetectionOverlayOptions {
        if options == nil {
            return LivenessDetectionOverlayOptions()
        }
    
        return LivenessDetectionOverlayOptions(
            language: options!.value(forKey: "language") != nil ? EkycIDLanguage(rawValue: options!.value(forKey: "language") as! String)! : .KH
        )
    }
}

extension DocumentScannerResult {
    func toDictionary() -> NSDictionary {
        return [
            "documentType": self.documentType.rawValue,
            "documentGroup": self.documentGroup.rawValue,
            "fullImage": self.fullImage.saveJPGToTemp("doc_full"),
            "documentImage": self.fullImage.saveJPGToTemp("doc_warped"),
            "faceImage": self.fullImage.saveJPGToTemp("face_card"),
        ]
    }
}

extension LivenessPrompt {
    func toDictionary() -> NSDictionary {
        return [
            "prompt": self.prompt.rawValue,
            "success": self.success,
        ]
    }
}

extension LivenessFace {
    func toDictionary(_ filename: String) -> NSDictionary {
        return [
            "image": self.image!.saveJPGToTemp(filename),
            "leftEyeOpenProbability": self.leftEyeOpenProbability,
            "rightEyeOpenProbability": self.rightEyeOpenProbability,
            "headEulerAngleX": self.headEulerAngleX,
            "headEulerAngleY": self.headEulerAngleY,
            "headEulerAngleZ": self.headEulerAngleZ,
            "headDirection": self.headDirection != nil ? self.headDirection!.rawValue : nil,
            "eyesStatus": self.eyesStatus != nil ? self.eyesStatus!.rawValue : nil,
        ]
    }
}

extension LivenessDetectionResult {
    func toDictionary() -> NSDictionary {
        return [
            "prompts": self.prompts.map { $0.toDictionary() },
            "frontFace": self.frontFace != nil ? self.frontFace!.toDictionary("face_front") : nil,
            "leftFace": self.frontFace != nil ? self.frontFace!.toDictionary("face_left") : nil,
            "rightFace": self.frontFace != nil ? self.frontFace!.toDictionary("face_right") : nil,
        ]
    }
}

extension UIImage {
    func saveJPGToTemp(_ name: String) -> String {
        let url = URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
            .appendingPathComponent(name, isDirectory: false)
            .appendingPathExtension("jpg")

        // Then write to disk
        if let data = self.jpegData(compressionQuality: 0.8) {
            do {
                try data.write(to: url)
            } catch {
                print("Handle the error, i.e. disk can be full")
            }
        }
        
        return url.absoluteString
    }
}
