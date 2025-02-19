# Server Setup

## Break Glass

- If canvas gets inappropriate or weird, log in to server, bring it down, delete backup.json, and HUP the daemon.

## Backend 

1. Create `.env.[production|development]`
    - `LOG_PATH` should point to a safe place that can't be overwritten. 