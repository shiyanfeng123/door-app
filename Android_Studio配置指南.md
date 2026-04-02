# Android Studio 配置指南

## 问题描述

当尝试运行 `npx cap open android` 命令时，出现以下错误：

```
[error] Unable to launch Android Studio. Is it installed?
        Attempted to open Android Studio at:
        You can configure this with the CAPACITOR_ANDROID_STUDIO_PATH
        environment variable.
```

## 解决方案

### 方法 1：设置环境变量

1. **找到 Android Studio 安装路径**
   - 默认安装路径：
     - Windows: `C:\Program Files\Android\Android Studio`
     - macOS: `/Applications/Android Studio.app`
     - Linux: `/opt/android-studio`

2. **设置环境变量**

   **Windows 系统：**
   1. 右键点击「此电脑」→「属性」→「高级系统设置」→「环境变量」
   2. 在「系统变量」中点击「新建」
   3. 变量名：`CAPACITOR_ANDROID_STUDIO_PATH`
   4. 变量值：Android Studio 的安装路径，例如：`C:\Program Files\Android\Android Studio`
   5. 点击「确定」保存

   **macOS 系统：**
   1. 打开终端
   2. 编辑 `~/.bash_profile` 或 `~/.zshrc` 文件
   3. 添加行：`export CAPACITOR_ANDROID_STUDIO_PATH=/Applications/Android Studio.app`
   4. 保存文件并运行 `source ~/.bash_profile` 或 `source ~/.zshrc`

   **Linux 系统：**
   1. 打开终端
   2. 编辑 `~/.bashrc` 文件
   3. 添加行：`export CAPACITOR_ANDROID_STUDIO_PATH=/opt/android-studio`
   4. 保存文件并运行 `source ~/.bashrc`

### 方法 2：直接指定路径运行

如果不想设置环境变量，可以在运行命令时直接指定 Android Studio 的路径：

```bash
CAPACITOR_ANDROID_STUDIO_PATH="C:\Program Files\Android\Android Studio" npx cap open android
```

### 方法 3：手动打开项目

如果以上方法都不行，您可以手动打开 Android 项目：

1. 打开 Android Studio
2. 选择「Open an existing project」
3. 导航到 `your-project/android` 目录并打开

## 验证 Android Studio 安装

1. 确保 Android Studio 已正确安装
2. 检查是否可以正常启动 Android Studio
3. 确保已安装必要的 SDK 和工具

## 其他可能的问题

1. **Android SDK 配置**：确保 Android SDK 路径正确配置
2. **Java 环境**：确保已安装并配置了 JDK
3. **权限问题**：确保有足够的权限访问 Android Studio 目录

如果您仍然遇到问题，请检查 Android Studio 的安装状态和系统环境配置。