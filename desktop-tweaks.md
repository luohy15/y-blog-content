# My Desktop Productivity Tools

## Window Management

Requirement: One-click switch to the target application.

Implementation (Windows): Use AutoHotkey, pin applications to fixed positions on the taskbar, and use forms like `#f::#1; #e::#2` for quick switching.

Implementation (Linux): Use i3wm, place the target application in a specified workspace, and set workspace shortcuts.

Implementation (macOS): Use Manico.

## Key Remapping

Requirement 1: Map CapsLock to Ctrl (long press) or ESC (single click).

Requirement 2 (Optional): Map Option + hjkl to Left, Down, Up, Right.

Implementation (Windows): Use AutoHotkey, [reference](https://gist.github.com/sedm0784/4443120).

Implementation (Linux): Use setxkbmap and xcape.

Implementation (macOS): Use Karabiner-Elements.
