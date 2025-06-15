# My Command Line Productivity Tools

## 3. Solarized

Strictly speaking, this is a color scheme, not a command-line tool.

So, the question is, why does it improve efficiency?

Because it's so ubiquitous, all my development interaction pages now use the Solarized dark color scheme.

No more wasting time on color schemes (~~indirectly improving efficiency~~).

## 2. Oh My Zsh

> The undisputed alias fanatic.

Install Oh My Zsh and configure several plugins:

```bash
plugins=(git golang docker docker-compose kubectl)
```

Then you can happily use:

```bash
gst, gd, ggpush, gob, gor, k, kaf, kgp
```

These strange commands.

Here are some aliases I'm interested in:

```bash
gst
gcam
gco
gd
glgg
ggpull
ggpush
ggpush -f
```

## 1. Atuin

Isn't it cool to store all your command history from all your terminals in a single SQLite database?

Never worry about forgetting a command you executed years ago again.
