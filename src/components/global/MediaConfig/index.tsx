import { SourceDeviceStateProps } from "@/hooks/useMediaSource"
import { useStudioSettings } from "@/hooks/useStudioSettings"
import Loader from "../Loader"
import { Mic, Monitor, SettingsIcon } from "lucide-react"

type Props = {
  state: SourceDeviceStateProps
  data:
    | ({
        subscription: {
          plan: "PRO" | "FREE"
        } | null
        studios: {
          id: string
          screen: string | null
          mic: string | null
          camera: string | null
          preset: "HD" | "SD"
          userId: string | null
        } | null
      } & {
        id: string
        email: string
        firstName: string | null
        lastName: string | null
        clerkId: string
        createdAt: Date
      })
    | null
}

const MediaConfig = ({ state, data }: Props) => {
  if (!state.displays?.length || !state.audioInputs?.length) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <Loader color="#fff" />
      </div>
    )
  }

  const initialScreenId = data?.studios?.screen ?? state.displays[0].id
  const initialMicId = data?.studios?.mic ?? state.audioInputs[0].deviceId
  const initialPreset = data?.studios?.preset ?? ("SD" as "HD" | "SD")

  const { register, isPending, onPreset } = useStudioSettings(
    data?.id!,
    initialScreenId,
    initialMicId,
    initialPreset,
    data?.subscription?.plan ?? "FREE"
  )

  return (
    <form
      className="flex h-full w-full flex-col gap-y-5"
    >
      {isPending && (
        <div className="fixed z-50 w-full top-0 right-0 bottom-0 h-full rounded-2xl bg-black/80 flex justify-center items-center">
          <Loader />
        </div>
      )}

      {/* ===== DISPLAY (Screen) SELECT ===== */}
      <div className="flex gap-x-5 justify-center items-center">
        <Monitor size={36} fill="#575655" color="#575655" />
        <select
          {...register("screen")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
          defaultValue={initialScreenId}
        >
          {state.displays.map((display) => (
            <option
              key={display.id}
              value={display.id}
              className="bg-[#171717] cursor-pointer"
            >
              {display.name}
            </option>
          ))}
        </select>
      </div>

      {/* ===== MICROPHONE SELECT ===== */}
      <div className="flex gap-x-5 justify-center items-center">
        <Mic size={36} fill="#575655" color="#575655" />
        <select
          {...register("audio")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
          defaultValue={initialMicId}
        >
          {state.audioInputs.map((mic) => (
            <option
              key={mic.deviceId}
              value={mic.deviceId}
              className="bg-[#171717] cursor-pointer"
            >
              {mic.label || mic.deviceId}
            </option>
          ))}
        </select>
      </div>

      {/* ===== PRESET (HD / SD) SELECT ===== */}
      <div className="flex gap-x-5 justify-center items-center">
        <SettingsIcon size={36} fill="#575655" color="#575655" />
        <select
          {...register("preset")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
          defaultValue={initialPreset}
        >
          <option
            value="HD"
            disabled={data?.subscription?.plan !== "PRO"}
            className="bg-[#171717] cursor-pointer"
          >
            1080p {data?.subscription?.plan === "FREE" && "(Upgrade to PRO)"}
          </option>
          <option value="SD" className="bg-[#171717] cursor-pointer">
            720p
          </option>
        </select>
      </div>
    </form>
  )
}

export default MediaConfig
