import os from "os";
import path from "path";
import fs from "@skpm/fs";
import { Artboard, Image } from "sketch/dom";

const FOLDER = path.join(os.tmpdir(), "com.sketchapp.envato-sketch-plugin");

export default (parentDocument, data) => {
  const guid = NSProcessInfo.processInfo().globallyUniqueString();
  const outputPath = path.join(FOLDER, `${guid}.${data.ext}`);
  const buffer = new Buffer(data.image, "base64");

  try {
    fs.mkdirSync(FOLDER);
  } catch (err) {
    // probably because the folder already exists
  }
  try {
    fs.writeFileSync(outputPath, buffer, "NSData");
    const artboard = new Artboard({
      parent: parentDocument.pages[0],
      frame: {
        width: data.width,
        height: data.height
      }
    });
    new Image({
      image: outputPath,
      parent: artboard,
      frame: { width: data.width, height: data.height }
    });
  } catch (err) {
    console.log(err.message);
    return undefined;
  }
};
