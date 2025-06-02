import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const httpsClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL
})

export const onCloseApp = () => window.ipcRenderer.send('close-app')

export const fetchUserProfile = async (clerkId: string) => {
  const response = await httpsClient.get(`/auth/${clerkId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response.data
}

export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke('get-sources')
  const enumerateDevices = await window.navigator.mediaDevices.enumerateDevices()
  const audioInputs = enumerateDevices.filter(device => device.kind === 'audioinput')

  return {displays, audio: audioInputs}
}

export const updateStudioSettings = async (
  screen: string, 
  id: string, 
  audio: string, 
  preset: 'SD' | 'HD'
) => {
  const response = await httpsClient.post(`/studio/${id}`, {
    screen,
    audio,
    preset
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response.data
}

export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send('hide-plugin', state)
}

export const videoRecordinTime = (ms: number) => {
  const second = Math.floor((ms / 1000) % 60).toString().padStart(2, '0')
  const minute = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, '0')
  const hour = Math.floor((ms / 1000 / 60 / 60) % 60).toString().padStart(2, '0')

  return {length: `${hour}:${minute}:${second}`, minute}
}