import { useEffect, useState } from "react";
import { postQueue } from "./api";
import useEventStore from "./store";
import { EventType } from "./types";

const Queue = () => {
    const [queue, setQueue] = useState(0);
    const eventData = useEventStore((state) => state.eventData);

    useEffect(() => {
        if (eventData?.type === EventType.Paint) {
            setQueue(eventData.queue);
        }
    }, [eventData]);

    const joinQueue = async () => {
        const response = await postQueue('John');
        console.log(response);
    }

    return (<div>
        <h3>Queue Size: {queue}</h3>
        <div>
            <button onClick={joinQueue}>Join</button>
        </div>
    </div>);
}

export default Queue;