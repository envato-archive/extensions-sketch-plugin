export default document => {
  let lastArtboard = null;
  let largestHypotenuse = 0;

  document.layers.forEach(layer => {
    // Calculate Hypotenuse from origin
    const layerOffset = Math.sqrt(
      Math.pow(layer.frame.y, 2) + Math.pow(layer.frame.x, 2)
    );

    if (layerOffset > largestHypotenuse) {
      largestHypotenuse = layerOffset;
      lastArtboard = layer;
    }
  });

  return lastArtboard;
};
