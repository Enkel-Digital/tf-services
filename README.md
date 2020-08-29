# Teletif Services
Monorepo for all the services used to run teletif.  
The other repos for teletif:
- [Admin portal](https://github.com/Enkel-Digital/tf-admin-portal)


## Services
- Admin API
    - API service for the admin to access data and to send notifications
- Billing
    - Might move the stuff into admin api, as alot of these are tightly coupled with the admin API
    - Allows RPC invocation from admin API to check a token's usage/limit
    - Allows admin API to register new notifications scheduled
    - Allows admin API to get number of notifications sent already and the limit on a particular token/bot/organization
    - In charge of charging the user
- Notify
    - Internal Service that actually sends the notifications
    - This is basically a webhook listener and Bot runner
    - Might change to use a pub/sub method instead of using HTTPS based webhooks
        - For better retries/re-queue when telegram API returns 429 to rate limit us
        - Using a intelligent queue with pub/sub is probably better then using a custom internal queue logic
    - This service is called by other services with data to send notifications IMMEDIATELY without delay
        - This service just takes care of running the bots to send the notifications without any of the scheduling
        - Scheduling is done else where...
- UserInputBot
    - Service for handling user's input for onboarding/help-menu/unsubscribing
    - Recieves updates from telegram server via a webhook setup


## Data Stores (DBs / Warehouses / In Mem caches ...)
- Main DB
    - 
- billing DB
    - Database for storing all billing related information
    - Only accessible by billing service
    - NoSQL DB?
    - [Schema](./billing.dbml)
