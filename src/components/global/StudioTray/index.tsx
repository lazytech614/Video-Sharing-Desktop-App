import { onStopRecording, startRecording } from "@/lib/recorder"
import { cn, videoRecordinTime } from "@/lib/utils"
import { Cast, Pause, Play, Square } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const StudioTray = () => {
    const initialTime = new Date()
    const videoElement = useRef<HTMLVideoElement | null>(null)
    const [preview, setPreview] = useState(false)
    const [recording, setRecording] = useState(false)
    const [onTimer, setOnTimer] = useState<string>('00:00:00')
    const [count, setCount] = useState(0)
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

    window.ipcRenderer.on('profile-recieved', (_, payload) => {
        setOnSources(payload)
    })

    const clearTime = () => {
      setCount(0)
      setOnTimer('00:00:00')
    }

    useEffect(() => {
      if(!recording) return 
      const recordTimeInterval = setInterval(() => {

        const time = count + (new Date().getTime() - initialTime.getTime())
        setCount(time)

        const recordingTime = videoRecordinTime(time)

        if(onSources?.plan === 'FREE' && recordingTime.minute === '05') {
          setRecording(false)
          clearTime()
          onStopRecording()
        }

        setOnTimer(recordingTime.length)

        if(time <= 0) {
          setOnTimer('00:00:00')
          clearInterval(recordTimeInterval)
        }
      }, 1)

      return () => clearInterval(recordTimeInterval)
    }, [recording])

  return !onSources ? (
    <></>
  ) : (
    <div className="flex flex-col justify-end gap-y-5 h-screen">
        {preview && (
          <video
            autoPlay
            ref={videoElement}
            className={cn(`w-6/12 self-end bg-white`)}
          />
        )}
        <div className="rounded-full flex justify-around items-center h-10 w-full border-2 bg-[#171717] draggable border-white/40">
            <div
                {...(onSources && {
                    onClick: () => {
                        setRecording(true)
                        startRecording(onSources)
                        
                    }
                })}
                className={cn(`non-draggable rounded-full cursor-pointer relative hover:opacity-80`, recording ? 'bg-red-600 w-4 h-4' : 'bg-green-600 w-4 h-4')}
            >
              {recording && (
                <span className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-white">
                  {onTimer}
                </span>
              )}
            </div>
            {!recording ? 
              <Play 
                className="non-draggable opacity-50 hover:scale-110 transform transition duration-150 cursor-pointer"
                size={20}
                fill="#fff"
                stroke="none"
              /> : 
              <Square 
                className="non-draggable cursor-pointer hover:scale-110 transform transition duration-150"
                size={20}
                fill="#fff"
                stroke="white"
                onClick={() => {
                  setRecording(false)
                  clearTime()
                  onStopRecording()
                }}
              />
            } 
            <Cast 
              onClick={() => setPreview((prev) => !prev)}
              size={20}
              fill="#fff"
              className="non-draggable hover:opacity-60 cursor-pointer"
              stroke="white"
            />
        </div>
    </div>
  )
}

export default StudioTray