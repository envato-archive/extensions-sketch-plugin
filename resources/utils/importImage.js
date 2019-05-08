import os from "os";
import path from "path";
import fs from "@skpm/fs";
import { Artboard, Image } from "sketch/dom";
import calculateImportCoordinates from "./calculateImportCoordinates";

const FOLDER = path.join(os.tmpdir(), "com.sketchapp.envato-sketch-plugin");
const IMPORT_IMAGE_WIDTH = 1000;

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
    const heightFactor = IMPORT_IMAGE_WIDTH / data.width;

    const height = data.height * heightFactor;
    const width = IMPORT_IMAGE_WIDTH;
    const importPage = parentDocument.selectedPage || parentDocument.pages[0];

    const coordinates = calculateImportCoordinates(importPage);

    const artboard = new Artboard({
      parent: importPage,
      frame: {
        x: coordinates.x,
        y: coordinates.y,
        width,
        height
      }
    });
    new Image({
      image: outputPath,
      parent: artboard,
      frame: { width, height }
    });
  } catch (err) {
    console.log(err.message);
    return undefined;
  }
};
