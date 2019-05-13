import Settings from "sketch/settings";
import { Document } from "sketch/dom";

import importRemoteFile from "../resources/utils/importRemoteFile";
import importImage from "./utils/importImage";

export default {
  connectToSketch: webContents => {
    const currentDocument = Document.getSelectedDocument();
    const documentId = currentDocument.id;

    const pluginVersion = require("../package.json").version;
    const licenseCode = Settings.settingForKey("license_code");
    const licenseEmail = Settings.settingForKey("license_email");
    const projectName = Settings.documentSettingForKey(
      currentDocument,
      "project_name"
    );
    const elementsToken = Settings.settingForKey("elements_token");
    const photoResponse = Settings.settingForKey("photo_response");

    webContents
      .executeJavaScript(`sketchConnected('${documentId}')`)
      .then(() => {
        webContents.executeJavaScript(`setPluginVersion('${pluginVersion}')`);
        webContents.executeJavaScript(
          `setLicense('${licenseCode}', '${licenseEmail}')`
        );
        webContents.executeJavaScript(`setElementsToken('${elementsToken}')`);
        webContents.executeJavaScript(`setProjectName('${projectName}')`);
        webContents.executeJavaScript(`setPhotoResponse('${photoResponse}')`);
      });
  },

  setProjectName: (webContents, document, name) => {
    Settings.setDocumentSettingForKey(document, "project_name", name);

    webContents.executeJavaScript(`setProjectName('${name}')`);
  },

  setLicense: (webContents, { code, email }) => {
    Settings.setSettingForKey("license_code", code);
    Settings.setSettingForKey("license_email", email);

    webContents.executeJavaScript(`setLicense('${code}', '${email}')`);
  },

  setPhotoResponse: (webContents, { response }) => {
    Settings.setSettingForKey("photo_response", response);

    webContents.executeJavaScript(`setPhotoResponse('${response}')`);
  },

  importRemoteFile: base64Data => {
    const document = Document.getSelectedDocument();
    importRemoteFile(document, base64Data);
  },

  importImage: data => {
    const document = Document.getSelectedDocument();
    importImage(document, {
      image: data.image,
      height: data.height,
      width: data.width,
      ext: data.ext
    });
  },

  openExternalLink: url =>
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url)),

  setElementsToken: (webContents, { token }) => {
    Settings.setSettingForKey("elements_token", token);

    webContents.executeJavaScript(`setElementsToken('${token}')`);
  }
};
