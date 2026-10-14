import SwiftUI
import UIKit

@main
struct TallyApp: App {
  @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
  @State private var counter = Counter.shared

  var body: some Scene {
    WindowGroup {
      ContentView(counter: counter)
    }
  }
}

/// Kept from the UIKit version of the app: links (tally://add) and saving on the way out.
final class AppDelegate: NSObject, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    NSLog("Tally: didFinishLaunching")
    return true
  }

  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    NSLog("Tally: app delegate opened \(url.absoluteString)")
    return Counter.shared.handle(url)
  }

  func applicationDidEnterBackground(_ application: UIApplication) {
    NSLog("Tally: app delegate entered background")
    Counter.shared.save()
  }
}
