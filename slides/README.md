# Welcome to [Slidev](https://github.com/slidevjs/slidev)!

To start the slide show:

- `pnpm install`
- `pnpm run dev`
- visit <http://localhost:3030>

Edit the [slides.md](./slides.md) to see the changes.

Learn more about Slidev at the [documentation](https://sli.dev/).

## Live terminal

Use `<LiveTerminal />` on any slide to embed a real shell via [ttyd](https://github.com/tsl0922/ttyd). Type commands during the presentation without leaving the deck.

### Prerequisites

Install ttyd once on your machine:

```bash
brew install ttyd
```

### Presenter workflow

Use two terminals:

```bash
# Terminal A — slides
cd slides && pnpm dev

# Terminal B — shell for live demos
cd slides && pnpm ttyd
```

Then open a slide with `<LiveTerminal />`, click inside the terminal (or press **Focus**), and run commands.

### Usage in slides

Embedded terminal (default height):

```md
# Deploy from the slide

<LiveTerminal />
```

Full-height demo slide (hide footer with slide class):

```md
---
layout: default
class: compact live-terminal-slide
---

# Live demo

<LiveTerminal full title="wrangler" />
```

Optional props: `url`, `title`, `height`, `full`, `fontSize`.

### Keyboard and focus

- Slide navigation (arrows, space) works when focus is on the slide, not inside the terminal.
- Click the terminal pane or **Focus** before typing.
- Click outside the terminal to return focus to Slidev.

### Limitations

- **Live only:** GitHub Pages builds have no ttyd backend. The component shows an offline message instead.
- **Security:** ttyd exposes your real shell. Use only on your machine during workshops. On untrusted networks, run ttyd with credentials (`ttyd -c user:pass ...`).
- **Session state:** Restarting `pnpm ttyd` starts a fresh shell.
- **Browser shortcuts:** Some combos (e.g. Ctrl+W) are reserved by the browser and cannot be forwarded to the terminal.
