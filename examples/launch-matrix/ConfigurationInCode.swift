// Row C: no scene manifest in Info.plist; the app delegate supplies the scene configuration in
// application(_:configurationForConnecting:options:) and the scene delegate creates the window.
import UIKit

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }
    let window = UIWindow(windowScene: windowScene)
    let root = UIViewController()
    root.view.backgroundColor = .systemBlue
    window.rootViewController = root
    window.makeKeyAndVisible()
    self.window = window
    NSLog("launch-matrix: scene willConnect")
  }
}

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    NSLog("launch-matrix: didFinishLaunching")
    reportVisibleWindows()
    return true
  }

  func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {
    let configuration = UISceneConfiguration(name: nil, sessionRole: connectingSceneSession.role)
    configuration.delegateClass = SceneDelegate.self
    return configuration
  }
}

func reportVisibleWindows() {
  DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
    let windows = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .filter { !$0.isHidden }
    NSLog("launch-matrix: visible windows in scenes: %d", windows.count)
  }
}
