import BrowserWindow from 'sketch-module-web-view'
import Settings from 'sketch/settings'
import { Document } from 'sketch/dom'

import importRemoteFile from '../resources/utils/importRemoteFile'

export default function(context) {
  const document = Document.getSelectedDocument()
  const documentId = document.id

  const options = {
    identifier: documentId,
    show: false,
    scrollBounce: true,
    width: 900,
    height: 700,
    minWidth: 400,
    minHeight: 400,
  }

  // Setup webview
  var browserWindow = new BrowserWindow(options)

  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents

  // Connect To Webview
  webContents.on('connectToSketch', () => {
    webContents.executeJavaScript(`sketchConnected('${documentId}')`)

    const licenseCode = Settings.settingForKey('license_code')
    const licenseEmail = Settings.settingForKey('license_email')
    webContents.executeJavaScript(
      `setLicense('${licenseCode}', '${licenseEmail}')`
    )
  })

  // Set Api Key
  webContents.on('setLicense', (licenseCode, licenseEmail) => {
    Settings.setSettingForKey('license_code', licenseCode)
    Settings.setSettingForKey('license_email', licenseEmail)

    webContents.executeJavaScript(
      `setLicense('${licenseCode}', '${licenseEmail}')`
    )
  })

  webContents.on('openFile', base64Data =>
    importRemoteFile(document, base64Data)
  )

  // Load webview
  browserWindow.loadURL('http://192.168.0.18:5000/')
}
