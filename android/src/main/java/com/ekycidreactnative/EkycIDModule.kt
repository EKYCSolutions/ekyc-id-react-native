package com.ekycidreactnative

import android.app.Activity
import android.content.Intent
import android.util.Log
import androidx.core.app.ActivityCompat.startActivityForResult
import com.ekycsolutions.ekycid.EkycID
import com.ekycsolutions.ekycid.activities.DocumentScannerActivity
import com.ekycsolutions.ekycid.activities.EkycIDExpressActivity
import com.ekycsolutions.ekycid.activities.LivenessDetectionActivity
import com.facebook.react.bridge.*

class EkycIDModule(private val reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext), ActivityEventListener, LifecycleEventListener {
  private val TAG = "EkycIDModule"
  private val EKYCID_EXPRESS_ACTIVITY_CODE = 2
  private val DOCUMENT_SCANNER_ACITIVITY_CODE = 0
  private val LIVENESS_DETECTION_ACITIVITY_CODE = 1
  private val STATUS_SCAN_CANCELED = "STATUS_SCAN_CANCELED"
  private val ERROR_ACTIVITY_DOES_NOT_EXIST = "ERROR_ACTIVITY_DOES_NOT_EXIST"

  private var currentPromise: Promise? = null

  init {
    reactContext.addActivityEventListener(this)
    reactContext.addLifecycleEventListener(this)
  }

  @ReactMethod
  fun startDocumentScanner(promise: Promise) {
    prepareScanning(promise)
    val intent = Intent(reactContext.currentActivity, DocumentScannerActivity::class.java)
    startActivityForResult(reactContext.currentActivity!!, intent, DOCUMENT_SCANNER_ACITIVITY_CODE, null)
  }

  @ReactMethod
  fun startLivenessDetection(promise: Promise) {
    prepareScanning(promise)
    val intent = Intent(reactContext.currentActivity, LivenessDetectionActivity::class.java)
    startActivityForResult(reactContext.currentActivity!!, intent, LIVENESS_DETECTION_ACITIVITY_CODE, null)
  }

  @ReactMethod
  fun startEkycIDExpress(promise: Promise) {
    prepareScanning(promise)
    val intent = Intent(reactContext.currentActivity, EkycIDExpressActivity::class.java)
    startActivityForResult(reactContext.currentActivity!!, intent, EKYCID_EXPRESS_ACTIVITY_CODE, null)
  }

  override fun getName(): String {
    return "EkycID"
  }

  override fun onHostResume() {
    // The baseURL will be set from RN
    EkycID.initialize("", reactContext)
  }

  override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
    Log.d(TAG, "::::onActivityResult")
    if (currentPromise != null) {
      if (resultCode == Activity.RESULT_OK) {
        when (requestCode) {
            DOCUMENT_SCANNER_ACITIVITY_CODE -> {
              Log.d(TAG, "DOCUMENT_SCANNER_ACITIVITY_CODE::::result")
              val mainSideSerializable = data!!.getSerializableExtra("mainSide")
              val secondarySideSerializable = data.getSerializableExtra("secondarySide")
              val response = WritableNativeMap().apply {
                putString("mainSide", mainSideSerializable.toString())
                putString("secondarySide", secondarySideSerializable.toString())
              }
              currentPromise!!.resolve(response)
            }
            LIVENESS_DETECTION_ACITIVITY_CODE -> {
              val resultSerializable = data!!.getSerializableExtra("result")
              val response = WritableNativeMap().apply {
                putString("result", resultSerializable.toString())
              }
              currentPromise!!.resolve(response)
            }
            EKYCID_EXPRESS_ACTIVITY_CODE -> {
              val livenessSerializable = data!!.getSerializableExtra("liveness")
              val mainSideSerializable = data!!.getSerializableExtra("mainSide")
              val secondarySideSerializable = data.getSerializableExtra("secondarySide")
              val response = WritableNativeMap().apply {
                putString("liveness", livenessSerializable.toString())
                putString("mainSide", mainSideSerializable.toString())
                putString("secondarySide", secondarySideSerializable.toString())
              }
              currentPromise!!.resolve(response)
            }
            else -> {
              currentPromise!!.resolve(null)
            }
        }
      } else if (resultCode == Activity.RESULT_CANCELED) {
        rejectPromise(STATUS_SCAN_CANCELED, "Scan canceled")
      }
    }
  }

  override fun onHostPause() {}

  override fun onHostDestroy() {}

  override fun onNewIntent(intent: Intent?) {}

  private fun prepareScanning(promise: Promise) {
    if (currentActivity == null) {
      rejectPromise(ERROR_ACTIVITY_DOES_NOT_EXIST, "Activity does not exist")
      return
    }

    this.currentPromise = promise
  }

  private fun rejectPromise(code: String, message: String) {
    if (currentPromise == null) {
      return
    }
    currentPromise!!.reject(code, message)
    currentPromise = null
  }
}
