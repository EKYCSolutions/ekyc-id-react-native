package com.ekycidreactnative

import android.util.Log
import android.util.Base64
import android.graphics.Bitmap
import java.util.*
import java.io.ByteArrayOutputStream
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.UIManagerHelper

import com.ekycidreactnative.utils.withPromise

import com.ekycsolutions.ekycid.models.FrameStatus
import com.ekycsolutions.ekycid.documentscanner.DocumentScannerResult
import com.ekycsolutions.ekycid.documentscanner.DocumentScannerOptions
import com.ekycsolutions.ekycid.documentscanner.DocumentScannerCameraView
import com.ekycsolutions.ekycid.documentscanner.DocumentScannerEventListener

class DocumentScannerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  val TAG = "DocumentScanner"

  override fun getName(): String {
    return "DocumentScanner"
  }

  private fun findCameraView(viewId: Int): DocumentScannerCameraView {
    Log.d(TAG, "Finding view $viewId...")
    val view = if (reactApplicationContext != null) UIManagerHelper.getUIManager(reactApplicationContext, viewId)?.resolveView(viewId) as DocumentScannerCameraView? else null
    Log.d(TAG,  if (reactApplicationContext != null) "Found view $viewId!" else "Couldn't find view $viewId!")
    return view ?: throw Exception("View with id $viewId not found.")
  }

  @ReactMethod
  fun start(viewTag: Int, options: ReadableMap, onInitialized: Callback, onDetection: Callback, onFrame: Callback, promise: Promise) {
    withPromise(promise) {
      try {
        val cameraView = findCameraView(viewTag)
        cameraView.setOptions(DocumentScannerOptions(options.getInt("preparingDuration")))
        cameraView.addListener(object: DocumentScannerEventListener {

          private fun bitmapToBase64(image: Bitmap): String {
            val stream = ByteArrayOutputStream()
            image.compress(Bitmap.CompressFormat.JPEG, 90, stream)
            val byteArray = stream.toByteArray()
            return Base64.encodeToString(byteArray, Base64.DEFAULT)
          }

          override fun onDetection(detection: DocumentScannerResult) {
            val event = Arguments.createMap().apply {
              putString("documentType", detection.documentType.name)
              putString("documentGroup", detection.documentGroup.name)
              putString("fullImage", bitmapToBase64(detection.fullImage))
              putString("documentImage", bitmapToBase64(detection.documentImage))
              if (detection.faceImage != null) {
                putString("faceImage", bitmapToBase64(detection.faceImage!!))
              } else {
                putString("faceImage", null)
              }
            }
            onDetection.invoke(event)
          }

          override fun onFrame(frameStatus: FrameStatus) {
            onFrame.invoke(frameStatus.name)
          }

          override fun onInitialize() {
            onInitialized.invoke()
          }
        })
        cameraView.start()
        return@withPromise true
      } catch (e: Exception) {
        Log.d(TAG, "Error starting $TAG")
        return@withPromise false
      }
    }
  }

  @ReactMethod
  fun stop(viewTag: Int, promise: Promise) {
    withPromise(promise) {
      try {
        val cameraView = findCameraView(viewTag)
        cameraView.stop()
        return@withPromise true
      } catch (e: Exception) {
        Log.d(TAG, "Error starting $TAG")
        return@withPromise false
      }
    }
  }

  @ReactMethod
  fun nextImage(viewTag: Int, promise: Promise) {
    withPromise(promise) {
      try {
        val cameraView = findCameraView(viewTag)
        cameraView.nextImage()
        return@withPromise true
      } catch (e: Exception) {
        Log.d(TAG, "Error starting $TAG")
        return@withPromise false
      }
    }
  }

  @ReactMethod
  fun setWhiteList(viewTag: Int, options: ReadableArray, promise: Promise) {
    withPromise(promise) {
      try {
        val cameraView = findCameraView(viewTag)
        cameraView.setWhiteList(options as ArrayList<String>)
        return@withPromise true
      } catch (e: Exception) {
        Log.d(TAG, "Error starting $TAG")
        return@withPromise false
      }
    }
  }
}
