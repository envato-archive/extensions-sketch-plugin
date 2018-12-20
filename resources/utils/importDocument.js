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

          let lastArtboard = null;
          let largestHypotenuse = 0;

          selectedDocument.layers.forEach(layer => {
            // Calculate Hypotenuse from origin
            const layerOffset = Math.sqrt(
              Math.pow(layer.frame.y, 2) + Math.pow(layer.frame.x, 2)
            );

            if (layerOffset > largestHypotenuse) {
              largestHypotenuse = layerOffset;
              lastArtboard = layer;
            }
          });

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
