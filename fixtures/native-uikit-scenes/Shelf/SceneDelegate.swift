import UIKit

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?
  private let router = Router()

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }
    let window = UIWindow(windowScene: windowScene)
    window.rootViewController = UINavigationController(rootViewController: router.root)
    window.makeKeyAndVisible()
    self.window = window
    NSLog("Shelf: scene willConnect")

    // Links and quick actions that launch the app arrive here instead of in launchOptions.
    if let url = connectionOptions.urlContexts.first?.url {
      router.open(url)
    }
    if let url = connectionOptions.userActivities.first?.webpageURL {
      router.open(url)
    }
    if let item = connectionOptions.shortcutItem {
      router.perform(item)
    }
  }

  // Custom scheme links: shelf://book/42
  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    if let url = URLContexts.first?.url {
      router.open(url)
    }
  }

  // Universal links and Handoff
  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    if let url = userActivity.webpageURL {
      router.open(url)
    }
  }

  // Home screen quick actions
  func windowScene(
    _ windowScene: UIWindowScene,
    performActionFor shortcutItem: UIApplicationShortcutItem,
    completionHandler: @escaping (Bool) -> Void
  ) {
    completionHandler(router.perform(shortcutItem))
  }

  func sceneDidBecomeActive(_ scene: UIScene) {
    router.refresh()
  }

  func sceneDidEnterBackground(_ scene: UIScene) {
    router.save()
  }
}
