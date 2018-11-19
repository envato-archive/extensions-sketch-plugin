import os from 'os'
import path from 'path'
import fs from '@skpm/fs'

import importDocument from './importDocument'

const FOLDER = path.join(os.tmpdir(), 'com.sketchapp.envato-sketch-plugin')

export default (parentDocument, base64Data) => {
  const guid = NSProcessInfo.processInfo().globallyUniqueString()
  const outputPath = path.join(FOLDER, `${guid}.sketch`)
  const buffer = new Buffer(base64Data, 'base64')

  try {
    fs.mkdirSync(FOLDER)
  } catch (err) {
    // probably because the folder already exists
  }
  try {
    fs.writeFileSync(outputPath, buffer)
    importDocument(parentDocument, outputPath)
    fs.unlinkSync(outputPath, err => {
      if (err) console.log('Error Deleting File.')
    })
  } catch (err) {
    console.log(err.message)
    return undefined
  }
}
