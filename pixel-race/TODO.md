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
- [ ] Rate Limiting
    - [x] Users
    - [x] Cloudflare
    - [ ] Only permit Cloudflare IPs
    - [ ] Disable NFS DNS. 
    - [ ] ~~How often someone can paint. - If IP is already queued, can't queue again.~~
    - [ ] How to stop a bot from spinning up a bunch of browsers / scripts?
    - [ ] ~~Repatcha~~
- [x] How much memory are things going to take
    - [x] Storing user connections 
    - [x] Storing Queue
    - [x] Storing Canvas
- [x] OG tags
- [x] can't paint bug.
- [x] Somehow track all painting history
- [ ] ~~Shorten JSON payloads~~ They already seem adequately short. Especially since NFS doesn't charge for bandwidth
- [ ] ~~Auth~~
    - [ ] ~~Maybe encode UUID so it's not stored as plaintext?~~
- [x] Add intro text. 
    - How to play
    - What's going on
- [ ] Can't modify a pixel already placed

# Priority
- [ ] Batch messages to clients
- [ ] Inspo from Bananarama
- [ ] Learn more link
- [ ] Add server log or server start. 
- [ ] Polish UI
    - [ ] Let user know they can queue points

# Soon
- [ ] Audit OG Tags
- [ ] Analytics (Not Google)
- [ ] Audit with friend (P)

# Later

- [ ] Don't destroy backend on redeploy. 
- [ ] Write a player for the data. 
- [ ] Add the ability for rooms.