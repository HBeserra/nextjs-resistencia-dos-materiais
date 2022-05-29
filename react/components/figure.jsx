import { Box } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";



export default function Figure({ data: input_data, url, sx }) {
    const [image_url, set_image_url] = useState()
    const [data, set_data] = useState(input_data)
    if (data != input_data) {
        set_image_url(undefined)
        set_data(input_data)
    }


    function update() {
        if (typeof (data) != 'object') return;
        let bodyFormData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            bodyFormData.append(key, value.toString())
            console.log("post req", key, value, bodyFormData)
        })

        axios({
            method: "post",
            url,
            data: bodyFormData,
            responseType: 'blob',
            headers: { "Content-Type": "multipart/form-data" },
        }).then(({ data }) => {
            console.log(data)
            return set_image_url(URL.createObjectURL(data))
        }).catch((error) => {
            console.error(error)
            return;
        })
    }

    useEffect(update, [data, url])

    if (!image_url) return;
    console.log({ image_url })
    return <>
        <Box
            component="img"
            sx={{
                px: 10,
                maxWidth: { md: '60vw' },
                ...sx
            }}
            alt="Diagrama"
            src={image_url}
        />
    </>
}