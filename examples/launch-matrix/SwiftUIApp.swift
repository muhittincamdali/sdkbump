// Row D: a SwiftUI App with no scene manifest in Info.plist.
import SwiftUI
import UIKit

@main
struct MatrixApp: App {
  init() {
    NSLog("launch-matrix: SwiftUI App init")
  }

  var body: some Scene {
    WindowGroup {
      Color.blue.onAppear {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
          let windows = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap(\.windows)
            .filter { !$0.isHidden }
          NSLog("launch-matrix: visible windows in scenes: %d", windows.count)
        }
      }
    }
  }
}
