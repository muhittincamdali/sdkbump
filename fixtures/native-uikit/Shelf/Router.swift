import UIKit

/// Opens books from links and quick actions, and keeps the reading list.
@MainActor
final class Router {
  let root = ShelfViewController()

  @discardableResult
  func open(_ url: URL) -> Bool {
    guard let id = url.pathComponents.last, url.host() == "book" || url.path().hasPrefix("/book/")
    else { return false }
    root.navigationController?.pushViewController(BookViewController(id: id), animated: false)
    return true
  }

  @discardableResult
  func perform(_ item: UIApplicationShortcutItem) -> Bool {
    guard item.type == "dev.sdkbump.fixtures.shelf.add" else { return false }
    showMessage("New book")
    return true
  }

  func refresh() {
    root.reload()
  }

  func save() {
    UserDefaults.standard.set(root.titles, forKey: "titles")
  }

  /// Presents an alert over whatever is on screen.
  func showMessage(_ text: String) {
    let alert = UIAlertController(title: text, message: nil, preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "OK", style: .default))
    let presenter = UIApplication.shared.keyWindow?.rootViewController
      ?? UIApplication.shared.windows.first?.rootViewController
    presenter?.present(alert, animated: true)
  }
}

final class ShelfViewController: UITableViewController {
  private(set) var titles = UserDefaults.standard.stringArray(forKey: "titles") ?? ["Dune", "Middlemarch"]

  override func viewDidLoad() {
    super.viewDidLoad()
    title = "Shelf"
    tableView.register(UITableViewCell.self, forCellReuseIdentifier: "book")
  }

  func reload() {
    tableView.reloadData()
  }

  override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    titles.count
  }

  override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "book", for: indexPath)
    var content = cell.defaultContentConfiguration()
    content.text = titles[indexPath.row]
    cell.contentConfiguration = content
    return cell
  }
}

final class BookViewController: UIViewController {
  private let id: String

  init(id: String) {
    self.id = id
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder: NSCoder) { nil }

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .systemBackground
    title = "Book \(id)"
  }
}
