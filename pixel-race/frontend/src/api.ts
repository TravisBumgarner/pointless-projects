import { Point } from "./types";
import { decodePoints, encodePoints } from "./utilities";

const API_URL = "http://localhost:8000";



export const getPaint = async () => {
    const response = await fetch(`${API_URL}/canvas`);
    return decodePoints(await response.json());
}


export const postPaint = async (data: Point[]) => {
    const encodedData = encodePoints(data);
    console.log('Sending encoded data:', encodedData);
    const response = await fetch(`${API_URL}/paint`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(encodedData),
    });
    return response.json();
}