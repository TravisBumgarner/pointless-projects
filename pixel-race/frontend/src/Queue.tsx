import { postQueue } from "./api";
import useStore from "./store";

const Queue = () => {
    const clientId = useStore((state) => state.clientId);
    const queue = useStore((state) => state.queue);
    const setAlert = useStore((state) => state.setAlert);
    
    const joinQueue = async () => {
        if (!clientId) {
            setAlert("Something went wrong. Please refresh the page.");
            return;
        }
        const success = await postQueue(clientId);
        if(success){
            setAlert("You have joined the queue.");
        }
        if (!success) {
            setAlert("Something went wrong. Please refresh the page.");
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