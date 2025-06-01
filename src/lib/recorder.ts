import { hidePluginWindow } from "./utils"
import {v4 as uuid} from 'uuid'

let videoTransferFileName: string | undefined
let mediaRecorder: MediaRecorder

export const startRecording = (onSources: {
    screen: string
    id: string
    audio: string
}) => {
    hidePluginWindow(true)
    videoTransferFileName = `${uuid()}-${onSources?.id.slice(0, 8)}.webm`
    // __TS-ignore: we “know” that initRecorder(stream) was called first
    mediaRecorder.start(1000)
}