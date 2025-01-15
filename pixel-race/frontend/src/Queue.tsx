import { postQueue } from "./api";

const Queue = () => {
    const joinQueue = async () => {
        const response = await postQueue('John');
        console.log(response);
    }

    return (<div>
        <h3>Queue</h3>
        <div>
            <button onClick={joinQueue}>Join</button>
        </div>
    </div>);
}

export default Queue;