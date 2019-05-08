import { Document, Artboard, Page } from "sketch/dom";

import processLayers from "./processLayers";
import getLastArtboard from "./getLastArtboard";

export default (parentDocument, documentToImport) => {
  const importedDocument = Document.open(
    documentToImport,
    (err, importDocument) => {
      importDocument.pages.forEach(page => {
        if (page.name === "Symbols") {
          const symbolsPage = Page.fromNative(page.sketchObject);
          symbolsPage.parent = parentDocument;
          return;
        }

        page.layers.forEach(layer => {
          const selectedDocument = parentDocument.selectedPage;

          const lastArtboard = getLastArtboard(selectedDocument);

          console.log(lastArtboard);

          const artboard = new Artboard({
            parent: parentDocument.selectedPage,
            id: layer.id,
            name: layer.name,
            frame: {
              ...layer.frame,
              x: lastArtboard.frame.x + lastArtboard.frame.width + 80,
              y: lastArtboard.frame.y
            }
          });

          processLayers(layer.layers, artboard);

          parentDocument.centerOnLayer(artboard);
        });
      });
    }
  );

  importedDocument.close();
};
