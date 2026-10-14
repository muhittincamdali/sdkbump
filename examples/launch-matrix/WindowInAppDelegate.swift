// The app delegate life cycle: the app delegate creates and shows the window itself.
// Rows A, B, E, F and H of the launch matrix use this file with different Info.plist files.
import UIKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let window = UIWindow(frame: UIScreen.main.bounds)
    let root = UIViewController()
    root.view.backgroundColor = .systemBlue
    window.rootViewController = root
    window.makeKeyAndVisible()
    self.window = window
    NSLog("launch-matrix: didFinishLaunching")
    reportVisibleWindows()
    return true
  }
}

/// Logs, a second after launch, how many visible windows belong to a connected scene.
/// Zero means the screen stays black.
func reportVisibleWindows() {
  DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
    let windows = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .filter { !$0.isHidden }
    NSLog("launch-matrix: visible windows in scenes: %d", windows.count)
  }
}
