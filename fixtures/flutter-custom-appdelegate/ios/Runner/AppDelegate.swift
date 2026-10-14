import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let controller = window?.rootViewController as! FlutterViewController
    let batteryChannel = FlutterMethodChannel(
      name: "samples.flutter.dev/battery",
      binaryMessenger: controller.binaryMessenger)
    batteryChannel.setMethodCallHandler { call, result in
      guard call.method == "getBatteryLevel" else {
        result(FlutterMethodNotImplemented)
        return
      }
      UIDevice.current.isBatteryMonitoringEnabled = true
      result(Int(UIDevice.current.batteryLevel * 100))
    }

    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // Sign-in callback: fluttercustom://auth?code=...
  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    if url.host == "auth" {
      let controller = window?.rootViewController as! FlutterViewController
      FlutterMethodChannel(name: "samples.flutter.dev/auth", binaryMessenger: controller.binaryMessenger)
        .invokeMethod("callback", arguments: url.absoluteString)
      return true
    }
    return super.application(app, open: url, options: options)
  }
}
