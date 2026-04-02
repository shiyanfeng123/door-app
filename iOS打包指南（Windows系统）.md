# iOS 打包指南（Windows 系统）

## 重要说明

**iOS 应用的构建和打包必须在 macOS 系统上进行**，这是 Apple 的官方要求。Windows 系统无法直接构建 iOS 应用。

## 解决方案

### 方案 1：使用云服务（推荐）

使用提供 macOS 环境的云服务来构建 iOS 应用。

#### 推荐的云服务：

1. **MacStadium**：提供专用的 macOS 云服务器
2. **AWS EC2 Mac 实例**：Amazon 提供的 macOS 云实例
3. **GitHub Actions**：支持 macOS 构建环境的 CI/CD 服务
4. **AppCenter**：微软提供的移动应用构建和分发服务
5. **Bitrise**：专门的移动应用 CI/CD 平台

#### 使用 GitHub Actions 示例：

1. 在项目根目录创建 `.github/workflows/ios-build.yml` 文件：

```yaml
name: iOS Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build web app
      run: npm run build
    - name: Install Capacitor
      run: npm install @capacitor/core @capacitor/cli
    - name: Add iOS platform
      run: npx cap add ios
    - name: Sync project
      run: npx cap sync
    - name: Build iOS app
      run: |
        cd ios
        xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -sdk iphoneos -archivePath $PWD/build/App.xcarchive archive
        xcodebuild -exportArchive -archivePath $PWD/build/App.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath $PWD/build
    - name: Upload artifact
      uses: actions/upload-artifact@v3
      with:
        name: ios-app
        path: ios/build
```

2. 提交代码到 GitHub，触发构建流程
3. 构建完成后，在 GitHub Actions 页面下载构建产物

### 方案 2：使用第三方构建服务

#### AppCenter 使用步骤：

1. 访问 [AppCenter](https://appcenter.ms/)
2. 创建账户并登录
3. 点击「Add new app」创建新应用
4. 选择「iOS」作为平台
5. 连接你的代码仓库（GitHub、Bitbucket 等）
6. 配置构建参数，选择「Release」配置
7. 启动构建
8. 构建完成后下载 IPA 文件

### 方案 3：借用 macOS 设备

如果有朋友或同事使用 macOS 设备，可以：

1. 将项目代码复制到 macOS 设备
2. 按照正常的 iOS 打包流程操作：
   - 安装 Xcode
   - 安装依赖：`npm install`
   - 构建 Web 应用：`npm run build`
   - 添加 iOS 平台：`npx cap add ios`
   - 同步项目：`npx cap sync`
   - 打开 Xcode：`npx cap open ios`
   - 在 Xcode 中进行归档和打包

## iOS 打包的必要条件

1. **macOS 系统**：必须运行 macOS 的设备
2. **Xcode**：Apple 官方开发工具，必须安装
3. **Apple Developer 账号**：用于签名和分发应用
4. **证书和描述文件**：用于应用签名

## 替代方案

如果暂时无法访问 macOS 环境，可以：

1. **优先构建 Android 应用**：在 Windows 系统上可以构建 Android 应用
2. **使用 PWA（渐进式 Web 应用）**：将应用作为网页应用发布，可在移动设备上添加到主屏幕

## 总结

由于 Apple 的限制，iOS 应用必须在 macOS 环境中构建。对于 Windows 用户，推荐使用云服务或第三方构建平台来完成 iOS 打包。

如果您有任何问题或需要进一步的帮助，请随时告知。