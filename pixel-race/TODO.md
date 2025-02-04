- [x] Write supported messages in client.ts
- [x] Improve communication for establishing/closing SSE events.  
- [x] Need to update points such that only most recent change to an (X,Y) point are saved locally. 
- [x] Queuing System
    - [x] Map it out.
    - [x] Let someone know they're next. 
    - [x] If someone doesn't paint within 5 seconds. 
    - [x] Only one at a time
- [x] Add backend validation
- [x] Write some API tests
    - [x] Post valid data length
    - [x] post invalid data length
    - [x] Invalid numbers (maybe move canvas size to shared between fe/be)
    - [x] Invalid chars (move colors to shared?)
- [x] Figure out billing
- [x] Deploy
- [x] How much memory are things going to take
    - [x] Storing user connections 
    - [x] Storing Queue
    - [x] Storing Canvas
- [x] OG tags
- [x] can't paint bug.
- [x] Somehow track all painting history
- [x] ~~Shorten JSON payloads~~ They already seem adequately short. Especially since NFS doesn't charge for bandwidth
- [x] ~~Auth~~
    - [ ] ~~Maybe encode UUID so it's not stored as plaintext?~~
- [x] Add intro text. 
    - How to play
    - What's going on
- [x] Can't modify a pixel already placed
- [x] Inspo from Bananarama
- [x] Learn more link
- [x] Add server log or server start. 
- [x] Bugs
    - [x] Start countdown, paint, start painting again, countdown goes 2x.
    - [x] Start countdown, don't paint, start again
- [x] Don't destroy backend on redeploy. 
- [x] Audit OG Tags
- [x] Be able to restore paint state on server restart. 
- [x] Check DNS
- [x] Analytics
- [x] Rate Limiting
    - [x] Users
    - [x] Cloudflare
    - [x] Only permit Cloudflare IPs
    - [x] Disable NFS DNS. 
    - [x] ~~How often someone can paint. - If IP is already queued, can't queue again.~~
    - [x] How to stop a bot from spinning up a bunch of browsers / scripts?
    - [x] ~~Repatcha~~
- [x] Check analytics
- [x] Make sure I'm getting the most from Cloudflare (and add to resume)
- [x] Polish UI

- [ ] Bug
     - [ ] Rate limit message showing up at random times. 
     - [ ] Queue not updating when it's person's time to paint

- [ ] Add alert for who's next, play sound, change title bar
- [ ] Add countdown sound. 
- [ ] Look into not maintaining Response object in memory.

# Soon
- [ ] Batch messages to clients
- [ ] Animate arrival of pixels
- [ ] Audit with friend (P)

# Later

- [ ] Write a player for the data. 
- [ ] Add the ability for rooms.