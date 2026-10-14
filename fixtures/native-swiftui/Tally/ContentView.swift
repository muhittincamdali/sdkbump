import SwiftUI
import UIKit

@MainActor
@Observable
final class Counter {
  static let shared = Counter()
  var value = UserDefaults.standard.integer(forKey: "value")

  func handle(_ url: URL) -> Bool {
    guard url.host() == "add" else { return false }
    value += 1
    return true
  }

  func save() {
    UserDefaults.standard.set(value, forKey: "value")
  }
}

struct ContentView: View {
  let counter: Counter

  var body: some View {
    VStack(spacing: 24) {
      Text("\(counter.value)")
        .font(.system(size: 96, weight: .bold, design: .rounded))
      Button("Add one") { counter.value += 1 }
        .buttonStyle(.borderedProminent)
      Button("Share") { share() }
    }
    .padding()
  }

  /// Shares the count with the system share sheet.
  private func share() {
    let sheet = UIActivityViewController(activityItems: ["Tally: \(counter.value)"], applicationActivities: nil)
    UIApplication.shared.windows.first?.rootViewController?.present(sheet, animated: true)
  }
}
