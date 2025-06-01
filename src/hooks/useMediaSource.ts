import { getMediaSources } from "@/lib/utils"
import { useReducer } from "react"

export type SourceDeviceStateProps = {
    displays?: {
        appIcon: null
        displayId: string
        id: string
        name: string
        thumbnail: unknown[]
    }[],
    audioInputs?: {
        deviceId: string
        groupId: string
        kind: string
        label: string
    }[],
    error?: string
    isPending?: boolean
}

type DisplayDeviceActionProps = {
    type: 'GET_DEVICES',
    payload: SourceDeviceStateProps
}

export const useMediaSources = () => {
    const [state, action] = useReducer<React.Reducer<SourceDeviceStateProps, DisplayDeviceActionProps>>((state: SourceDeviceStateProps, action: DisplayDeviceActionProps) => {
        switch (action.type) {
            case 'GET_DEVICES':
                return {...state, ...action.payload}
            default:
                return state
        }
    }, {
        displays: [],
        audioInputs: [],
        error: undefined,
        isPending: false
    })

    const fetchMediaSources = () => {
        action({
            type: 'GET_DEVICES',
            payload: {
                isPending: true
            }
        })
        getMediaSources().then((sources) => action({
            type: 'GET_DEVICES',
            payload: {
                displays: sources.displays,
                audioInputs: sources.audio,
                isPending: false
            }
        }))
    }

    return {state, fetchMediaSources}
}