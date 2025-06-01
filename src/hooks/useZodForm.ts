import z from "zod"
import {DefaultValues, useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export const useZodForm = <T extends z.ZodType<any>>(
    schema: T,
    defaultValues?: DefaultValues<z.TypeOf<T>> | undefined
) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues,
    })
    return {
        register,
        handleSubmit,
        errors,
        watch,
        reset,
    }
}