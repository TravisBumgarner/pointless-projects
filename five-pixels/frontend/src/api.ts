import { ErrorType, PointMap, QueuePostResponse } from "../../shared";
import {
  ErrorResponse,
  InitResponse,
  PostPaintResponse,
} from "../../shared/types/rest";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const init = async (): Promise<InitResponse | ErrorResponse> => {
  let response;
  try {
    response = await fetch(`${API_URL}/init`);

    if (response.status === 429) {
      return {
        error: ErrorType.RateLimitError,
      };
    }

    const data = await response.json();
    return {
      canvas: data.canvas as PointMap,
      queue: data.queue as number,
    };
  } catch {
    return {
      error: ErrorType.UnknownError,
    };
  }
};

export const postPaint = async ({
  token,
  points,
  clientId,
}: {
  token: string;
  points: PointMap;
  clientId: string;
}): Promise<PostPaintResponse | ErrorResponse> => {
  const body = {
    points,
    clientId,
    token,
  };

  const response = await fetch(`${API_URL}/paint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 429) {
    return {
      error: ErrorType.RateLimitError,
    };
  }

  return {
    success: response.status === 200,
  };
};

export const postQueue = async ({
  clientId,
  token,
}: {
  clientId: string;
  token: string;
}): Promise<QueuePostResponse | ErrorResponse> => {
  const response = await fetch(`${API_URL}/queue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clientId, token }),
  });

  if (response.status === 429) {
    return {
      error: ErrorType.RateLimitError,
    };
  }

  return response.json();
};
