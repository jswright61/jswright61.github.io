---
layout: single
title:  Configuring Pry
date: 2022-04-14 06:26:54 -0400
categories: ruby terminal
---

# Configuring Pry

I use Pry as my REPL for all my Ruby projects. In fact, Pry is one of the reasons Ruby has "stuck" with me. I find
the commands both intuitive and helpful. I have a text expansion that I constantly use in development:
;pry -> binding.pry if !@jsw_skip_pry
The if clause is there to allow easy exits from loops - once I see what I need to see, I set the instance variable
to true to avoid all subsequent breaks.

I have been using Pry for years and I have never messed with its configuration. Just this week I was debugging a
pretty involved class. The instantiated class often has A LOT of instance variables (maybe that's a code smell?
That's a topic for another day which may never come). I was getting an exception in this instantiated class unrelated
to the instance variables. Pry's default exception handler, which is one of the reason's I love Pry, in this case was
spitting out all of the instance variables which was taking up literally hundreds of lines in my terminal and I was
having to scroll through all of these lines to see the actual exception that was being thrown. It got to be too much. I
went in search of options to tame the exception output. Pry did not disapoint. I found a [great resource for configuring
Pry's exception handler](https://github.com/pry/pry/wiki/Customization-and-configuration#Config_exception). Lot's of
options there. The big takeaways for me were that it's fairly trivial to override its default handler and that you can
do it in either the active session, or in a .pryrc file[^1].

Here is my Pry exception handler from my .pryrc in my home directory:
```ruby
Pry.config.exception_handler = proc do |output, exception, _|
  output.puts "#{exception.class.name}: #{exception.message}\n"
  exception.backtrace.each {|ebt| output.puts ebt if ebt.match?(/^(?!.*(__pry__|\/gems\/|<main>)).*$/)}
end
```
This handler omits the default handler's object inspection, which is what causes all the instance variables to be
displayed. I am also filtering the backtrace to exclude any lines referencing, pry, gems, and main because 99% of the
time I am only interested in errors from my code and this dramtically reduces the backtrace. If I ever need the more
verbose default exception, I can always comment out my code in my ~/.pryrc and start a new session, or, better yet,
create a different handler in my current Pry session:
```ruby
pry_instance.config.exception_handler = proc do |output, exception, _|
  output.puts "#{exception.class}: #{exception.message}"
  output.puts "from #{exception.backtrace.first}"
end
```








[^1]: .pryrc files follow a common configuration convention in that your directory tree is searched from root to your current directory for .pryrc files and options are loaded from any found. Settings from earlier .pryrcs found closer to your working directory override the earlier setting.