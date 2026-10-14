// Row G: Info.plist names this scene delegate, which creates no window; the window is still made
// by the app delegate in WindowInAppDelegate.swift (compiled together with this file).
import UIKit

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    NSLog("launch-matrix: scene willConnect, no window created")
  }
}
