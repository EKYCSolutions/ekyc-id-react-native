package com.ekycidreactnative

import android.util.Log
import com.ekycidreactnative.utils.withPromise
import com.ekycsolutions.ekycid.Initializer
import com.ekycsolutions.ekycid.documentscanner.DocumentScannerOptions
import com.facebook.react.bridge.*

class EkycIDModule(private val reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext),
  LifecycleEventListener {

  private var ekycInitializer: Initializer? = null

  init {
    reactContext.addLifecycleEventListener(this)
    this.ekycInitializer = Initializer(reactContext.applicationContext)
  }

  override fun getName(): String {
    return "EkycID"
  }

  @ReactMethod
  fun startDocumentScanner(promise: Promise) {
    withPromise(promise) {
      return@withPromise true
    }
  }

  override fun onHostResume() {
    this.ekycInitializer!!.start { }
  }

  override fun onHostPause() {}

  override fun onHostDestroy() {}
}
