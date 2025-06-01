import { updateStudioSettingsSchema } from "@/schemas/studio-settings.schema"
import { useZodForm } from "./useZodForm"
import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateStudioSettings } from "@/lib/utils"
import { toast } from "sonner"

export const useStudioSettings = (
    id: string,
    screen?: string | null,
    audio?: string | null,
    preset?: 'SD' | 'HD',
    plan?: 'PRO' | 'FREE'
) => {
    const [onPreset, setOnPreset] = useState<'HD' | 'SD' | undefined>()

    const {register, watch} = useZodForm(updateStudioSettingsSchema, {
        screen: screen!,
        audio: audio!,
        preset: preset!,
    })

    const {mutate, isPending} = useMutation({
        mutationKey: ['update-studio'],
        mutationFn: (data: {
            screen: string
            id: string
            audio: string
            preset: 'SD' | 'HD'
        }) => updateStudioSettings(data.screen, id, data.audio, data.preset),
        onSuccess: (data) => {
            return toast(data.status === 200 ? 'Updated successfully' : 'Failed to update', {
                description: data.message
            })
        }
    })

    useEffect(() => {
        if(screen && audio) {
            window.ipcRenderer.send('media-sources', {
                screen,
                audio,
                preset,
                plan,
                id
            })
        }
    }, [screen, audio])

    useEffect(() => {
        const subscribe = watch((val) => {
            setOnPreset(val.preset)
            mutate({
                screen: val.screen!,
                id,
                audio: val.audio!,
                preset: val.preset!
            })
            window.ipcRenderer.send('media-sources', {
                screen: val.screen!,
                audio: val.audio!,
                preset: val.preset!,
                plan,
                id
            })
        })

        return () => subscribe.unsubscribe()
    }, [watch])

    return {
        register,
        watch,
        onPreset,
        setOnPreset,
        isPending
    }
}