import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react"
import Loader from "../Loader"
import { useEffect, useState } from "react"
import { fetchUserProfile } from "@/lib/utils"
import { useMediaSources } from "@/hooks/useMediaSource"
import MediaConfig from "../MediaConfig"

const Widget = () => {
    const [profile, setProfile] = useState<{
        status: number,
        data: 
          | ({
            subscription: {
                plan: 'FREE' | 'PRO'
            } | null
            studios: {
                id: string
                screen: string | null
                mic: string | null
                preset: 'SD' | 'HD'
                camera: string | null
                userId: string | null
            } | null
          } & {
            id: string
            firstName: string
            lastName: string
            email: string
            clerkId: string
            createdAt: Date
          })
        | null
    } | null>(null)

    const {user} = useUser()

    const {state, fetchMediaSources} = useMediaSources()

    // console.log("State: ", state);
    // console.log("Profile: ", profile);

    useEffect(() => {
        if(user && user.id) {
            fetchUserProfile(user.id).then((profile: any) => setProfile(profile))
        }
    }, [user])

    useEffect(() => {
        fetchMediaSources()
    }, [])

  return (
    <div className="p-5">
        <ClerkLoading>
            <div className="h-full flex justify-center items-center">
                <Loader />
            </div>
        </ClerkLoading>
        <SignedIn>
            {profile ? (
                <MediaConfig 
                    state={state}
                    data={profile?.data}
                />
            ) : (
                <div className="w-full h-full flex justify-center items-center">
                    <Loader color="#fff" />
                </div>
            )}
        </SignedIn>
    </div>
  )
}

export default Widget