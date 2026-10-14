import UIKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  private let router = Router()

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let window = UIWindow(frame: UIScreen.main.bounds)
    window.rootViewController = UINavigationController(rootViewController: router.root)
    window.makeKeyAndVisible()
    self.window = window
    NSLog("Shelf: didFinishLaunching")

    if let url = launchOptions?[.url] as? URL {
      router.open(url)
    }
    if let item = launchOptions?[.shortcutItem] as? UIApplicationShortcutItem {
      router.perform(item)
      return false
    }
    return true
  }

  // Custom scheme links: shelf://book/42
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    router.open(url)
  }

  // Universal links and Handoff
  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([any UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    guard let url = userActivity.webpageURL else { return false }
    return router.open(url)
  }

  // Home screen quick actions
  func application(
    _ application: UIApplication,
    performActionFor shortcutItem: UIApplicationShortcutItem,
    completionHandler: @escaping (Bool) -> Void
  ) {
    completionHandler(router.perform(shortcutItem))
  }

  func applicationDidBecomeActive(_ application: UIApplication) {
    router.refresh()
  }

  func applicationDidEnterBackground(_ application: UIApplication) {
    router.save()
  }
}
