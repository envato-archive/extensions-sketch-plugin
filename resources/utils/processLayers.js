import { Image, Shape, Text, Group, SymbolInstance } from 'sketch/dom'

export default (layers, parent) =>
  layers.map(layer => {
    // Group Layer
    if (layer.type === 'Group') {
      const group = Group.fromNative(layer.sketchObject)
      group.parent = parent
      group.frame = layer.frame

      return group

      // Text Layer
    } else if (layer.type === 'Text') {
      const text = Text.fromNative(layer.sketchObject)
      text.parent = parent
      text.frame = layer.frame

      return text
    } else if (layer.type === 'SymbolInstance') {
      // TODO: Figure out what to do with symbol masters that dont exist?
      const symbolInstance = SymbolInstance.fromNative(layer.sketchObject)
      symbolInstance.parent = parent
      symbolInstance.frame = layer.frame

      return symbolInstance
    } else if (layer.type === 'Shape') {
      const shape = Shape.fromNative(layer.sketchObject)
      shape.parent = parent
      shape.frame = layer.frame

      return shape
    } else if (layer.type === 'Image') {
      const image = Image.fromNative(layer.sketchObject)
      image.parent = parent
      image.frame = layer.frame

      return image
    } else {
      console.log('** Unhandled Layer **')
      console.log(layer)
    }
  })
