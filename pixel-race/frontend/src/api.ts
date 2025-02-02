import { ErrorType, PointMap, QueuePostResponse } from "../../shared";
import { ErrorResponse, InitResponse, PostPaintResponse } from "../../shared/types/rest";

const API_URL = "http://localhost:8000";


export const init = async (): Promise<InitResponse | ErrorResponse> => {
    let response
    try {
        response = await fetch(`${API_URL}/init`);
        
        if (response.status === 429) {
            return {
                error: ErrorType.RateLimitError
            }
        }
        
        const data = await response.json();
        return {
            canvas: data.canvas as PointMap,    
            queue: data.queue as number
        }
    } catch (error) {
        console.error('init error', error)
        return {
            error: ErrorType.RateLimitError
        }
    }
}

export const postPaint = async (points: PointMap, clientId: string): Promise<PostPaintResponse | ErrorResponse> => {
    const body = {
        points,
        clientId: clientId
    }

    const response = await fetch(`${API_URL}/paint`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    if (response.status === 429) {
        return {
            error: ErrorType.RateLimitError
        }
    }

    return {
        success: response.status === 200
    }
}

export const postQueue = async (clientId: string): Promise<QueuePostResponse | ErrorResponse> => {
    const response = await fetch(`${API_URL}/queue`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clientId }),
    });

    if (response.status === 429) {
        return {
            error: ErrorType.RateLimitError
        }
    }

    return response.json();
}
