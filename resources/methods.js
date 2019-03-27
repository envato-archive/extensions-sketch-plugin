import Settings from "sketch/settings";
import { Document } from "sketch/dom";

import importRemoteFile from "../resources/utils/importRemoteFile";
import importImage from "./utils/importImage";

export default {
  connectToSketch: webContents => {
    const documentId = Document.getSelectedDocument().id;
    webContents.executeJavaScript(`sketchConnected('${documentId}')`);

    const pluginVersion = require("../package.json").version;
    webContents.executeJavaScript(`setPluginVersion('${pluginVersion}')`);

    const licenseCode = Settings.settingForKey("license_code");
    const licenseEmail = Settings.settingForKey("license_email");
    webContents.executeJavaScript(
      `setLicense('${licenseCode}', '${licenseEmail}')`
    );

    const elementsToken = Settings.settingForKey("elements_token");
    webContents.executeJavaScript(`setElementsToken('${elementsToken}')`);

    const projectName = Settings.documentSettingForKey("project_name");
    webContents.executeJavaScript(`setProjectName('${projectName}')`);

    const photoResponse = Settings.settingForKey("photo_response");
    webContents.executeJavaScript(`setPhotoResponse('${photoResponse}')`);
  },

  setProjectName: (webContents, name) => {
    Settings.setDocumentSettingForKey("project_name", name);

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
