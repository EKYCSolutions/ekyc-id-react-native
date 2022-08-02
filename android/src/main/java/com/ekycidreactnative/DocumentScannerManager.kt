package com.ekycidreactnative

import android.annotation.SuppressLint
import android.util.Log
import android.view.ViewGroup
import com.ekycsolutions.ekycid.documentscanner.DocumentScannerCameraView
import com.facebook.react.bridge.*
import com.facebook.react.common.MapBuilder
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager


class DocumentScannerManager(private val reactContext: ReactApplicationContext): ViewGroupManager<DocumentScannerCameraView>() {
  val TAG = "DocumentScanner"

  override fun getName(): String {
    return "DocumentScanner"
  }

  @SuppressLint("ResourceType")
  override fun createViewInstance(context: ThemedReactContext): DocumentScannerCameraView {
    val documentScannerCameraView = DocumentScannerCameraView(context.reactApplicationContext.currentActivity, null)
    documentScannerCameraView.layoutParams = ViewGroup.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
    )
    Log.d(TAG, ":::: createViewInstance")
    reactContext.getJSModule(RCTDeviceEventEmitter::class.java).emit("onCreated", null);
    Log.d(TAG, ":::: createViewInstance - emited")
    return documentScannerCameraView
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any>? {
    return MapBuilder.builder<String, Any>()
      .put("onCreated", MapBuilder.of("registrationName", "onCreated"))
      .build()
  }
}
