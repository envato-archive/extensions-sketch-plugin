import { Document, Artboard, Page } from "sketch/dom";

import processLayers from "./processLayers";

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
          const lastArtboard =
            selectedDocument.layers[selectedDocument.layers.length - 1];

          const importFrame = { x: 0, y: 0 };

          if (lastArtboard) {
            importFrame.x =
              lastArtboard.frame.x + lastArtboard.frame.width + 80;
            importFrame.y = lastArtboard.frame.y;
          }

          const artboard = new Artboard({
            parent: parentDocument.selectedPage,
            id: layer.id,
            name: layer.name,
            frame: {
              ...layer.frame,
              x: importFrame.x,
              y: importFrame.y
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
