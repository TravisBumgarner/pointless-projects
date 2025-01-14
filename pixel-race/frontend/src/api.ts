

const API_URL = "http://localhost:8080/paint";

export const getPaint = async () => {
    const response = await fetch(API_URL);
    return response.json();
}

export const postPaint = async (data: any) => {
    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response.json();
}