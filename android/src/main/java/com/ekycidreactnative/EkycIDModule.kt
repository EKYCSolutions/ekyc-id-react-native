package com.ekycidreactnative

import android.app.Activity
import android.content.Intent
import android.util.Log
import androidx.core.app.ActivityCompat.startActivityForResult
import com.beust.klaxon.Klaxon
import com.ekycidreactnative.utils.ArrayUtil
import com.ekycidreactnative.utils.MapUtil
import com.ekycsolutions.ekycid.EkycID
import com.ekycsolutions.ekycid.activities.DocumentScannerActivity
import com.ekycsolutions.ekycid.activities.EkycIDExpressActivity
import com.ekycsolutions.ekycid.activities.LivenessDetectionActivity
import com.ekycsolutions.ekycid.core.objectdetection.ObjectDetectionObjectType
import com.ekycsolutions.ekycid.documentscanner.DocumentScannerOptions
import com.ekycsolutions.ekycid.documentscanner.ScannableDocument
import com.ekycsolutions.ekycid.documentscanner.cameraview.DocumentScannerCameraOptions
import com.ekycsolutions.ekycid.documentscanner.overlays.DocumentScannerOverlayOptions
import com.ekycsolutions.ekycid.livenessdetection.LivenessDetectionOptions
import com.ekycsolutions.ekycid.livenessdetection.cameraview.LivenessDetectionCameraOptions
import com.ekycsolutions.ekycid.livenessdetection.cameraview.LivenessPromptType
import com.ekycsolutions.ekycid.livenessdetection.overlays.LivenessDetectionOverlayOptions
import com.ekycsolutions.ekycid.utils.EkycIDLanguage
import com.facebook.react.bridge.*

class EkycIDModule(private val reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext), ActivityEventListener, LifecycleEventListener {
  private val TAG = "EkycIDModule"
  private val EKYCID_EXPRESS_ACTIVITY_CODE = 2
  private val DOCUMENT_SCANNER_ACITIVITY_CODE = 0
  private val LIVENESS_DETECTION_ACITIVITY_CODE = 1
  private val STATUS_SCAN_CANCELED = "STATUS_SCAN_CANCELED"
  private val ERROR_ACTIVITY_DOES_NOT_EXIST = "ERROR_ACTIVITY_DOES_NOT_EXIST"
  private val klaxon = Klaxon()

  private var currentPromise: Promise? = null

  init {
    reactContext.addActivityEventListener(this)
    reactContext.addLifecycleEventListener(this)
  }

  @ReactMethod
  fun startDocumentScanner(scannerOptions: ReadableMap?, overlayOptions: ReadableMap?, promise: Promise) {
    prepareScanning(promise)
    val intent = Intent(reactContext.currentActivity, DocumentScannerActivity::class.java)
    intent.putExtra("scannerOptions", buildDocumentScannerScannerOptions(scannerOptions))
    intent.putExtra("overlayOptions", buildDocumentScannerOverlayOptions(overlayOptions))
    startActivityForResult(reactContext.currentActivity!!, intent, DOCUMENT_SCANNER_ACITIVITY_CODE, null)
  }

  @ReactMethod
  fun startLivenessDetection(scannerOptions: ReadableMap?, overlayOptions: ReadableMap?, promise: Promise) {
    prepareScanning(promise)
    val intent = Intent(reactContext.currentActivity, LivenessDetectionActivity::class.java)
    intent.putExtra("scannerOptions", buildLivenessDetectionScannerOptions(scannerOptions))
    intent.putExtra("overlayOptions", buildLivenessDetectionOverlayOptions(overlayOptions))
    Log.d(TAG, "startLivenessDetection: intent scannerOptions ${buildLivenessDetectionScannerOptions(scannerOptions)}")
    Log.d(TAG, "startLivenessDetection: intent overlayOptions ${buildLivenessDetectionScannerOptions(overlayOptions)}")
    startActivityForResult(reactContext.currentActivity!!, intent, LIVENESS_DETECTION_ACITIVITY_CODE, null)
  }

  @ReactMethod
  fun startEkycIDExpress(
    documentScannerScannerOptions: ReadableMap?,
    documentScannerOverlayOptions: ReadableMap?,
    livenessDetectionScannerOptions: ReadableMap?,
    livenessDetectionOverlayOptions: ReadableMap?,
    promise: Promise
  ) {
    prepareScanning(promise)

    val intent = Intent(reactContext.currentActivity, EkycIDExpressActivity::class.java)
    intent.putExtra("documentScannerScannerOptions", buildDocumentScannerScannerOptions(documentScannerScannerOptions))
    intent.putExtra("documentScannerOverlayOptions", buildDocumentScannerOverlayOptions(documentScannerOverlayOptions))
    intent.putExtra("livenessDetectionScannerOptions", buildLivenessDetectionScannerOptions(livenessDetectionScannerOptions))
    intent.putExtra("livenessDetectionOverlayOptions", buildLivenessDetectionOverlayOptions(livenessDetectionOverlayOptions))
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
    Log.d(TAG, "onActivityResult: $data")
    if (currentPromise != null) {
      if (resultCode == Activity.RESULT_OK) {
        when (requestCode) {
            DOCUMENT_SCANNER_ACITIVITY_CODE -> {
              val response = hashMapOf<String, Any?>(
                "mainSide" to data!!.getSerializableExtra("mainSide") as HashMap<String, Any?>,
                "secondarySide" to data.getSerializableExtra("secondarySide") as HashMap<String, Any?>?
              )
              currentPromise!!.resolve(MapUtil.toWritableMap(response))
            }
            LIVENESS_DETECTION_ACITIVITY_CODE -> {
              val response = hashMapOf<String, Any?>(
                "result" to data!!.getSerializableExtra("result") as HashMap<String, Any?>
              )
              currentPromise!!.resolve(MapUtil.toWritableMap(response))
            }
            EKYCID_EXPRESS_ACTIVITY_CODE -> {
              Log.d("liveness", data!!.getSerializableExtra("liveness").toString())
              val response = hashMapOf<String, Any?>(
                "liveness" to data!!.getSerializableExtra("liveness") as HashMap<String, Any?>,
                "mainSide" to data!!.getSerializableExtra("mainSide") as HashMap<String, Any?>,
                "secondarySide" to data.getSerializableExtra("secondarySide") as HashMap<String, Any?>?
              )
              currentPromise!!.resolve(MapUtil.toWritableMap(response))
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

  private fun buildDocumentScannerScannerOptions(options: ReadableMap?): DocumentScannerOptions {
    if (options == null) {
      return DocumentScannerOptions()
    }

    val cameraOptions = if (options.getMap("cameraOptions") != null) {
      val map = MapUtil.toMap(options.getMap("cameraOptions")!!)
      DocumentScannerCameraOptions(
        preparingDuration = ((map["preparingDuration"] ?: 3) as Double).toInt()
      )
    } else {
      DocumentScannerCameraOptions()
    }

    val scannableDocuments = if (options.getArray("scannableDocuments") != null) {
      val array = ArrayUtil.toArray(options.getArray("scannableDocuments")!!)
      ArrayList(array.map { it ->
        val map = it as Map<String, String?>
        ScannableDocument(
          mainSide = ObjectDetectionObjectType.valueOf(map["mainSide"]!!),
          secondarySide = if (map["secondarySide"] != null) ObjectDetectionObjectType.valueOf(map["secondarySide"]!!) else null,
        )
      })
    } else {
      arrayListOf<ScannableDocument>()
    }

    return DocumentScannerOptions(
      cameraOptions = cameraOptions,
      scannableDocuments = scannableDocuments
    )
  }

  private fun buildDocumentScannerOverlayOptions(options: ReadableMap?): DocumentScannerOverlayOptions {
    if (options == null) {
      return DocumentScannerOverlayOptions()
    }

    return DocumentScannerOverlayOptions(
      language = if (options.getString("language") != null) {
        EkycIDLanguage.valueOf(options.getString("language")!!)
      } else {
        EkycIDLanguage.EN
             },
    )
  }

  private fun buildLivenessDetectionScannerOptions(options: ReadableMap?): LivenessDetectionOptions {
    Log.d(TAG, "buildLivenessDetectionScannerOptions: $options")
    if (options == null) {
      return LivenessDetectionOptions()
    }

    val cameraOptions = if (options.getMap("cameraOptions") != null) {
      val map = MapUtil.toMap(options.getMap("cameraOptions")!!)
      val prompts = map["prompts"] as ArrayList<String>
      LivenessDetectionCameraOptions(
        promptTimerCountDownSec = (map["promptTimerCountDownSec"] ?: 5) as Int,
        prompts = ArrayList(prompts.map { LivenessPromptType.valueOf(it) })
      )
    } else {
      LivenessDetectionCameraOptions()
    }



    return LivenessDetectionOptions(
      cameraOptions = cameraOptions,
    )
  }

  private fun buildLivenessDetectionOverlayOptions(options: ReadableMap?): LivenessDetectionOverlayOptions {
    if (options == null) {
      return LivenessDetectionOverlayOptions()
    }

    return LivenessDetectionOverlayOptions(
      language = if (options.getString("language") != null) {
        EkycIDLanguage.valueOf(options.getString("language")!!)
      } else {
        EkycIDLanguage.EN
      },
    )
  }
}
