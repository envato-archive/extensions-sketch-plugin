import BrowserWindow from "sketch-module-web-view";
import Settings from "sketch/settings";
import { Document } from "sketch/dom";

import importRemoteFile from "../resources/utils/importRemoteFile";

const GLOB = { browserWindow: null };

export default function(context) {
  const document = Document.getSelectedDocument();
  const documentId = document.id;

  const existingBrowserWindow = BrowserWindow.fromId(documentId);
  if (existingBrowserWindow) {
    GLOB.browserWindow = existingBrowserWindow;
    GLOB.browserWindow.show();
  } else {
    const options = {
      identifier: documentId,
      show: true,
      scrollBounce: true,
      width: 900,
      height: 700,
      minWidth: 400,
      minHeight: 400
    };

    GLOB.browserWindow = new BrowserWindow(options);
    GLOB.browserWindow.loadURL(
      "http://sketch.envatoextensions.com/webapp/index.html"
    );
  }

  const webContents = GLOB.browserWindow.webContents;

  webContents.on("ready-to-show", () => {
    GLOB.browserWindow.show();
  });

  // Connect To Webview
  webContents.on("connectToSketch", () => {
    webContents.executeJavaScript(`sketchConnected('${documentId}')`);

    const pluginVersion = require("../package.json").version;
    const licenseCode = Settings.settingForKey("license_code");
    const licenseEmail = Settings.settingForKey("license_email");
    webContents.executeJavaScript(
      `setLicense('${licenseCode}', '${licenseEmail}')`
    );
    webContents.executeJavaScript(`setPluginVersion('${pluginVersion}')`);
  });

  // Set Api Key
  webContents.on("setLicense", (licenseCode, licenseEmail) => {
    Settings.setSettingForKey("license_code", licenseCode);
    Settings.setSettingForKey("license_email", licenseEmail);

    webContents.executeJavaScript(
      `setLicense('${licenseCode}', '${licenseEmail}')`
    );
  });

  webContents.on("openFile", base64Data =>
    importRemoteFile(document, base64Data)
  );

  webContents.on("openExternalLink", url =>
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url))
  );
}
