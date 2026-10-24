# API tests for Trello (sample)

Postman collection for the Trello REST API (https://developer.atlassian.com/cloud/trello/rest/).

## What is covered
**Card lifecycle** (the collection creates its own temporary board and deletes it at the end):
create board, read board and lists, create / read / update card, add comment, read card actions, delete card, delete board, and confirm that deleted objects return 404.

**Negative checks:** missing credentials, invalid token, malformed board id, unknown board id, card without a required list.

Each request checks status code, response fields, data types and response time.

## Setup
1. Get an API key and token for your own Trello account (https://trello.com/power-ups/admin).
2. Import `Trello.postman_collection.json` and `Trello.postman_environment.json` into Postman.
3. Select the environment and fill in `apiKey` and `apiToken` (keep them in Postman only, never commit them).
4. Run the collection.

Command line:
```
npx newman run Trello.postman_collection.json -e Trello.postman_environment.json --env-var apiKey=YOUR_KEY --env-var apiToken=YOUR_TOKEN
```

## Note
The tests only touch the board they create and remove it after the run.
