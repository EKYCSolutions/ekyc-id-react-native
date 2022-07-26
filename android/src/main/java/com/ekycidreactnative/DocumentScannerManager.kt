package com.ekycidreactnative

import android.view.View
import android.app.Activity
import android.view.LayoutInflater
import com.facebook.react.common.MapBuilder
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager

import com.ekycsolutions.ekycid.documentscanner.DocumentScannerCameraView

class DocumentScannerManager(reactContext: ReactApplicationContext): ViewGroupManager<DocumentScannerCameraView>() {
  val TAG = "DocumentScanner"

  override fun getName(): String {
    return "DocumentScanner"
  }

  override fun createViewInstance(context: ThemedReactContext): DocumentScannerCameraView {
    val cameraViewView: View = LayoutInflater.from(context as Activity).inflate(R.layout.document_scanner_viewfinder, null)
    return cameraViewView.findViewById(R.id.documentScannerViewFinder)
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any>? {
    return MapBuilder.builder<String, Any>()
      .put("onCreated", MapBuilder.of("registrationName", "onCreated"))
      .build()
  }
}
