import { cn, onCloseApp } from "@/lib/utils"
import { UserButton } from "@clerk/clerk-react"
import { X } from "lucide-react"
import { useState } from "react"
import AppLogo from "../../public/Nuvue-logo.svg"

type Props = {
    children: React.ReactNode,
    className?: string
}

const ControlLayout = ({ children, className}: Props) => {
    const [isVisible, setIsVisible] = useState(false)

    window.ipcRenderer.on('hide-plugin', (event, payload) => {
        console.log(event);
        setIsVisible(payload.state)
    })

  return (
    <div className={cn(className, isVisible && 'invisible', 'bg-[#171717] flex px-1 flex-col rounded-3xl border-2 border-neutral-700 overflow-hidden')}>
      <div className="flex justify-between items-center p-5 draggable">
        <span className="non-draggable">
          <UserButton />
        </span>
        <X 
          size={20}
          className="text-gray-400 non-draggable hover:text-white cursor-pointer"
          onClick={onCloseApp}
        />
      </div>
      <div className="flex-1 h-0 overflow-auto">
        {children}
      </div>
      <div className="p-5 flex w-full">
        <div className="flex items-center gap-x-2">
          <img src={AppLogo} alt="app logo" className="w-8" />
          <p className="text-white text-2xl">Nuevue</p>
        </div>
      </div>
    </div>
  )
}

export default ControlLayout