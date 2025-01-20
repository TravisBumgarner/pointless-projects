import { postQueue } from "./api";
import useStore from "./store";

const Queue = () => {
    const clientId = useStore((state) => state.clientId);
    const queue = useStore((state) => state.queue);
    const setQueue = useStore((state) => state.setQueue);
    const addAlert = useStore((state) => state.addAlert);
    const placeInQueue = useStore((state) => state.placeInQueue);
    const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
    
    const joinQueue = async () => {
        if (!clientId) {
            addAlert("Something went wrong. Please refresh the page.");
            return;
        }
        const response = await postQueue(clientId);
        if(response.p !== null){
            if (response.p === 1) {
                addAlert("You are the first in the queue.");
            } else {
                addAlert("You have joined the queue.");
            }
            setQueue(response.p);
            setPlaceInQueue(response.p);
        }
        if (!response) {
            addAlert("Something went wrong. Please refresh the page.");
        }
    }

    return (<div>
        <h3>{placeInQueue !== null ? `Queue: ${placeInQueue} / ${queue}` : `Queue: ${queue}`}</h3>
        <div>
            <button onClick={joinQueue}>Join</button>
        </div>
    </div>);
}

export default Queue;