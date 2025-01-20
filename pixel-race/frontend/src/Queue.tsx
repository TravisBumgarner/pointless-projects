import { postQueue } from "./api";
import useStore from "./store";

const Queue = () => {
    const clientId = useStore((state) => state.clientId);
    const queue = useStore((state) => state.queue);
    const setQueue = useStore((state) => state.setQueue);
    const addAlert = useStore((state) => state.addAlert);
    
    const joinQueue = async () => {
        if (!clientId) {
            addAlert("Something went wrong. Please refresh the page.");
            return;
        }
        const response = await postQueue(clientId);
        if(response.p !== null){
            addAlert("You have joined the queue.");
            setQueue(response.p);
        }
        if (!response) {
            addAlert("Something went wrong. Please refresh the page.");
        }
    }

    return (<div>
        <h3>Queue Size: {queue}</h3>
        <div>
            <button onClick={joinQueue}>Join</button>
        </div>
    </div>);
}

export default Queue;