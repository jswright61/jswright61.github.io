# Publish date rules shared by bin/publish and the pre-push hook.
#
# A post is new when it's in _posts/ at a commit but not on origin/main. Its
# front matter `date:` is the publish date shown on the post, so relative
# references in the copy ("last month", "earlier this week") are read against
# it. A new post's date can be moved to today only when the move is small
# enough that those references still hold.

require "date"

module PostDates
  # Calendar days from the publish date through today, counting both
  MAX_CALENDAR_DAYS = 13
  EMPTY_TREE = "4b825dc642cb6eb9a060e54bf8d69288fbee4904"

  module_function

  def new_posts(base, head)
    base ||= EMPTY_TREE
    `git diff --name-only --no-renames --diff-filter=A #{base} #{head} -- _posts`
      .split("\n")
      .grep(/\.(md|markdown)\z/)
  end

  def front_matter(text)
    text[/\A---\s*\n(.*?)\n---\s*$/m, 1].to_s
  end

  def publish_date(text)
    value = front_matter(text)[/^date:\s*["']?(\d{4}-\d{2}-\d{2})/, 1]
    value && Date.iso8601(value)
  end

  def title(text, path)
    front_matter(text)[/^title:\s*["']?(.*?)["']?\s*$/, 1] || File.basename(path, ".*")
  end

  def pretty(date)
    date.strftime("%-d %B, %Y")
  end

  # Returns a reason the date can't be moved to today, or nil if it can
  def problem(date, today = Date.today)
    if date.nil?
      "has no publish date. Add a `date:` line to its front matter."
    elsif date > today
      "is dated #{pretty(date)}, which is in the future."
    elsif [date.year, date.month] != [today.year, today.month]
      "is dated #{pretty(date)}, and the month has changed since then."
    elsif (today - date).to_i + 1 > MAX_CALENDAR_DAYS
      days = (today - date).to_i + 1
      "is dated #{pretty(date)}, #{days} calendar days ago counting today (limit #{MAX_CALENDAR_DAYS})."
    end
  end
end
