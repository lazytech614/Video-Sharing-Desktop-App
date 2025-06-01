import { startRecording } from "@/lib/recorder"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"

const StudioTray = () => {
    const initialTime = new Date()
    const videoElement = useRef<HTMLVideoElement | null>(null)
    const [preview, setPreview] = useState(false)
    const [onSources, setOnSources] = useState<
      | {
        screen: string
        id: string
        audio: string
        preset: 'SD' | 'HD'
        plan: 'PRO' | 'FREE'
      }
      | undefined
    >(undefined)
    const [recording, setRecording] = useState(false)

    window.ipcRenderer.on('profile-recieved', (_, payload) => {
        setOnSources(payload)
    })

  return !onSources ? (
    <></>
  ) : (
    <div className="flex flex-col justify-end gap-y-5 h-screen">
        <video
            autoPlay
            ref={videoElement}
            className={cn(`w-6/12 border-2`, preview ? 'hidden' : '')}
        />
        <div className="rounded-full flex justify-around items-center h-20 w-full border-2 bg-[#171717] draggable border-white/40">
            <div
                {...onSources && {
                    onClick: () => {
                        setRecording(true)
                        startRecording(onSources)
                    }
                }}
                className={cn(`non-draggable rounded-full cursor-pointer relative hover:opacity-80`, recording ? 'bg-red-600 w-6 h-6' : 'bg-green-600 w-8 h-8')}
            ></div>
        </div>
    </div>
  )
}

export default StudioTray