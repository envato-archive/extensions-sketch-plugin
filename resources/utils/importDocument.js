import { Document, Artboard, Page } from "sketch/dom";

import processLayers from "./processLayers";
import calculateImportCoordinates from "./calculateImportCoordinates";

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

          const coordinates = calculateImportCoordinates(selectedDocument);

          const artboard = new Artboard({
            parent: parentDocument.selectedPage,
            id: layer.id,
            name: layer.name,
            frame: {
              ...layer.frame,
              x: coordinates.x,
              y: coordinates.y
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
