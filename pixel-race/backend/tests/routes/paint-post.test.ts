import request from "supertest";
import { v4 as uuidv4 } from 'uuid';
import { CANVAS_HEIGHT_INDICES, CANVAS_WIDTH_INDICES, MAX_PAINT_POINTS } from "../../../shared";
import { app } from "../../src/server";
import { canvas } from "../../src/singletons/canvas";
import { queue } from "../../src/singletons/queue";
import { pause } from "../utilities";

describe("POST /paint", () => {
    afterEach(() => {
        queue.releaseCurrentClient()
        canvas.clearCanvas()
        queue.clearQueue()
    });

  it("should not permit painting if not the current client", async () => {
    const userId = uuidv4();
    const someOtherUserId = uuidv4();
    queue.add(someOtherUserId);

    const response = await request(app)
      .post("/paint")
      .send({ points: { "0_0": "A" }, clientId: userId });

    expect(response.statusCode).toBe(400);
    expect(canvas.getCanvas()).toEqual({});
  });

  it("should not permit an invalid payload", async () => {
    const clientId = uuidv4();
    const response = await request(app)
      .post("/paint")
      .send({ pointsdads: { "0_0": "A" }, clientId });

    expect(response.statusCode).toBe(400);
    expect(canvas.getCanvas()).toEqual({});
    const response2 = await request(app)
      .post("/paint")
      .send({ points: { "0_0": "A" }, clieasdqwdntId: clientId });

    expect(response2.statusCode).toBe(400);
    expect(canvas.getCanvas()).toEqual({});
  });

  it("should not permit painting if too many points", async () => {
    const clientId = uuidv4();
    const payload = {
      points: {
        "0_0": "A",
        "0_1": "B",
        "0_2": "C",
        "0_3": "D",
        "0_4": "E",
        "0_5": "F",
        "0_6": "G",
        "0_7": "H",
        "0_8": "I",
        "0_9": "J",
      },
      clientId,
    };

    if (Object.keys(payload.points).length <= MAX_PAINT_POINTS) {
      throw new Error(`Max points has changed and the test is failing.`);
    }

    const response = await request(app).post("/paint").send(payload);

    expect(response.statusCode).toBe(400);
    expect(canvas.getCanvas()).toEqual({});
  });

  it("should not permit painting invalid colors", async () => {
    const clientId = uuidv4();
    queue.add(clientId);
    queue.processQueue()
    const points = { "0_0": "AA" };

    const response = await request(app)
      .post("/paint")
      .send({ points, clientId });

    expect(response.statusCode).toBe(400);
    expect(canvas.getCanvas()).toEqual({});
  })

  it("should permit painting valid indices", async () => {
    const clientId = uuidv4();
    queue.add(clientId);
    queue.processQueue()
    const points = { "0_0": "A", [`${CANVAS_WIDTH_INDICES - 1}_${CANVAS_HEIGHT_INDICES - 1}`]: "B" };

    const response = await request(app)
      .post("/paint")
      .send({ points, clientId });

    expect(response.statusCode).toBe(200);
    expect(canvas.getCanvas()).toEqual(points);
  })

  it("should not permit painting invalid indices", async () => {
    const clientId = uuidv4();
    queue.add(clientId);
    queue.processQueue()
    const points = { [`${CANVAS_WIDTH_INDICES}_${CANVAS_HEIGHT_INDICES}`]: "A" };

    const response = await request(app)
      .post("/paint")
      .send({ points, clientId });

    expect(response.statusCode).toBe(400);
    expect(canvas.getCanvas()).toEqual({});
  })

  it("should permit painting if the current client", async () => {
    const clientId = uuidv4();
    queue.add(clientId);
    queue.processQueue()
    const points = { "0_0": "A" };

    await pause(1000);

    const response = await request(app)
      .post("/paint")
      .send({ points, clientId });
    expect(response.statusCode).toBe(200);
    expect(canvas.getCanvas()).toEqual(points);
  });
});
