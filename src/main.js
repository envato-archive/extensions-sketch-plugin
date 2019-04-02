import BrowserWindow from "sketch-module-web-view";
import { Document } from "sketch/dom";

import METHODS from "../resources/methods";

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

  // Method Definitions
  webContents.on("connectToSketch", () => METHODS.connectToSketch(webContents));
  webContents.on("setLicense", (licenseCode, licenseEmail) =>
    METHODS.setLicense(webContents, { code: licenseCode, email: licenseEmail })
  );
  webContents.on("setProjectName", name =>
    METHODS.setProjectName(webContents, document, name)
  );
  webContents.on("setPhotoResponse", response =>
    METHODS.setPhotoResponse(webContents, { response })
  );
  webContents.on("setElementsToken", token =>
    METHODS.setElementsToken(webContents, { token })
  );
  webContents.on("openFile", base64Data =>
    METHODS.importRemoteFile(base64Data)
  );
  webContents.on("openImage", data => METHODS.importImage(data));
  webContents.on("openExternalLink", url => METHODS.openExternalLink(url));
}
