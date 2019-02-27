import BrowserWindow from "sketch-module-web-view";
import Settings from "sketch/settings";
import { Document } from "sketch/dom";

import importRemoteFile from "../resources/utils/importRemoteFile";

const GLOB = {
  loaderWindow: null,
  browserWindow: null,
  URL:
    process.env.ENV === "development"
      ? "http://localhost:5000"
      : "http://sketch.envatoextensions.com/webapp/index.html",
  browserTitle:
    process.env.ENV === "development"
      ? "Envato Elements DEV"
      : "Envato Elements"
};

export default function(context) {
  const document = Document.getSelectedDocument();
  const documentId = document.id;

  const existingBrowserWindow = BrowserWindow.fromId(documentId);
  if (existingBrowserWindow) {
    GLOB.browserWindow = existingBrowserWindow;
    GLOB.browserWindow.show();
  } else {
    const windowConfig = {
      width: 900,
      height: 700,
      minWidth: 400,
      minHeight: 400,
      title: GLOB.browserTitle,
      backgroundColor: "#F8F8FA"
    };
    const loaderOptions = {
      ...windowConfig,
      identifier: "loader-window",
      show: true
    };
    const options = {
      ...windowConfig,
      identifier: documentId,
      show: false,
      scrollBounce: true
    };

    GLOB.loaderWindow = new BrowserWindow(loaderOptions);
    GLOB.loaderWindow.loadURL(require("../resources/loading.html"));

    GLOB.browserWindow = new BrowserWindow(options);
    GLOB.browserWindow.loadURL(GLOB.URL);
  }

  const webContents = GLOB.browserWindow.webContents;

  webContents.once("did-finish-load", () => {
    setTimeout(() => {
      GLOB.loaderWindow.hide();
      GLOB.browserWindow.show();
    }, 200);
  });

  // Connect To Webview
  webContents.on("connectToSketch", () => {
    webContents.executeJavaScript(`sketchConnected('${documentId}')`);

    const pluginVersion = require("../package.json").version;
    webContents.executeJavaScript(`setPluginVersion('${pluginVersion}')`);

    const licenseCode = Settings.settingForKey("license_code");
    const licenseEmail = Settings.settingForKey("license_email");
    webContents.executeJavaScript(
      `setLicense('${licenseCode}', '${licenseEmail}')`
    );

    const photoResponse = Settings.settingForKey("photo_response");
    webContents.executeJavaScript(`setPhotoResponse('${photoResponse}')`);
  });

  // Set Api Key
  webContents.on("setLicense", (licenseCode, licenseEmail) => {
    Settings.setSettingForKey("license_code", licenseCode);
    Settings.setSettingForKey("license_email", licenseEmail);

    webContents.executeJavaScript(
      `setLicense('${licenseCode}', '${licenseEmail}')`
    );
  });

  // Record Response
  webContents.on("setPhotoResponse", response => {
    Settings.setSettingForKey("photo_response", response);

    webContents.executeJavaScript(`setPhotoResponse('${response}')`);
  });

  webContents.on("openFile", base64Data =>
    importRemoteFile(document, base64Data)
  );

  webContents.on("openExternalLink", url =>
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url))
  );
}
