# API tests for JSONPlaceholder (sample)

Postman collection with automated checks for the public API https://jsonplaceholder.typicode.com.

## What is covered
- **Posts:** list, single, filter by `userId`, create, full update, partial update, delete, non-existent id (404)
- **Users:** list, single user with nested `address` and `company`, unique ids, e-mail format
- **Comments:** nested route and query filter return consistent data

Each request checks status code, content type, response time (< 2 s), field presence and data types.

## Run
Import `JSONPlaceholder.postman_collection.json` into Postman and press Run, or from the command line:

```
npx newman run JSONPlaceholder.postman_collection.json
```

Last run: 12 requests, 34 assertions, 0 failed.

## Note
JSONPlaceholder is a fake API: POST, PUT, PATCH and DELETE return realistic responses but do not save changes. The tests check the response contract, not stored data.
