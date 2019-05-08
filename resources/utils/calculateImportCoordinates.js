export default document => {
  let lastArtboard = null;
  let largestHypotenuse = 0;
  let coordinates = { x: 0, y: 0 };

  document.layers.forEach(layer => {
    // Calculate Hypotenuse from origin
    const layerOffset = Math.sqrt(
      Math.pow(layer.frame.y, 2) + Math.pow(layer.frame.x, 2)
    );

    if (!lastArtboard) {
      lastArtboard = layer;
    } else if (layerOffset > largestHypotenuse) {
      largestHypotenuse = layerOffset;
      lastArtboard = layer;
    }
  });

  if (lastArtboard) {
    coordinates = {
      x: lastArtboard.frame.x + lastArtboard.frame.width + 80,
      y: lastArtboard.frame.y
    };
  }

  return coordinates;
};
