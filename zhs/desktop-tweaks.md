# 我的桌面效率工具

## 窗口管理

需求：一键切换至目标应用

实现 (Windows)：使用 AutoHotkey，将应用固定在任务栏固定的位置，使用 `#f::#1; #e::#2` 这样的形式快速切换

实现 (Linux)：使用 i3wm，将目标应用放置于指定 workspace，设定 workspace 快捷键

实现 (MacOS)：使用 Manico

## 键位映射

需求 1：将 CapsLock 映射为 Ctrl (长按) 或 ESC (单击)

需求 2 (可选)：Option + hjkl 映射为 左下上右

实现 (Windows)：使用 AutoHotkey，[参考](https://gist.github.com/sedm0784/4443120)

实现 (Linux)：使用 setxkbmap 和 xcape

实现 (MacOS)：使用 Karabiner-Elements

## 双拼输入

需求：使用小鹤双拼作为输入方式

实现：使用 Sogou
