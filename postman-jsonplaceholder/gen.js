const fs = require('fs');
const base = '{{baseUrl}}';
const t = (lines) => ({ listen: 'test', script: { type: 'text/javascript', exec: lines } });
const req = (name, method, path, tests, body) => ({
  name,
  event: [t(tests)],
  request: {
    method,
    header: body ? [{ key: 'Content-Type', value: 'application/json; charset=UTF-8' }] : [],
    ...(body ? { body: { mode: 'raw', raw: JSON.stringify(body, null, 2) } } : {}),
    url: { raw: base + path, host: [base], path: path.split('?')[0].split('/').filter(Boolean),
      ...(path.includes('?') ? { query: path.split('?')[1].split('&').map(p => { const [key, value] = p.split('='); return { key, value }; }) } : {}) }
  }
});
const status = (c) => `pm.test("Status code is ${c}", () => pm.response.to.have.status(${c}));`;
const fast = `pm.test("Response time < 2000 ms", () => pm.expect(pm.response.responseTime).to.be.below(2000));`;
const json = `pm.test("Content-Type is JSON", () => pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json"));`;

const collection = {
  info: { name: 'JSONPlaceholder API tests (sample)', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    description: 'Sample API test suite for the public JSONPlaceholder service: positive, negative and schema checks for /posts, /users and /comments.' },
  variable: [{ key: 'baseUrl', value: 'https://jsonplaceholder.typicode.com' }],
  item: [
    { name: 'Posts', item: [
      req('GET all posts', 'GET', '/posts', [status(200), json, fast,
        'const body = pm.response.json();',
        'pm.test("Returns an array of 100 posts", () => { pm.expect(body).to.be.an("array"); pm.expect(body).to.have.lengthOf(100); });',
        'pm.test("Every post has required fields", () => body.forEach(p => pm.expect(p).to.have.all.keys("userId","id","title","body")));']),
      req('GET single post', 'GET', '/posts/1', [status(200), json,
        'const p = pm.response.json();',
        'pm.test("Post id is 1", () => pm.expect(p.id).to.eql(1));',
        'pm.test("Field types are correct", () => { pm.expect(p.userId).to.be.a("number"); pm.expect(p.title).to.be.a("string"); pm.expect(p.body).to.be.a("string"); });']),
      req('GET non-existent post returns 404', 'GET', '/posts/99999', [status(404),
        'pm.test("Body is empty object", () => pm.expect(pm.response.json()).to.eql({}));']),
      req('GET posts filtered by userId', 'GET', '/posts?userId=1', [status(200),
        'pm.test("All posts belong to user 1", () => { const b = pm.response.json(); pm.expect(b).to.not.be.empty; b.forEach(p => pm.expect(p.userId).to.eql(1)); });']),
      req('POST create post', 'POST', '/posts', [status(201), json,
        'const p = pm.response.json();',
        'pm.test("Response echoes sent data", () => { pm.expect(p.title).to.eql("qa sample title"); pm.expect(p.body).to.eql("qa sample body"); pm.expect(p.userId).to.eql(1); });',
        'pm.test("New id is assigned", () => pm.expect(p.id).to.be.a("number"));'],
        { title: 'qa sample title', body: 'qa sample body', userId: 1 }),
      req('PUT update post', 'PUT', '/posts/1', [status(200),
        'pm.test("Title is updated", () => pm.expect(pm.response.json().title).to.eql("updated title"));'],
        { id: 1, title: 'updated title', body: 'updated body', userId: 1 }),
      req('PATCH partially update post', 'PATCH', '/posts/1', [status(200),
        'pm.test("Only title changed", () => { const p = pm.response.json(); pm.expect(p.title).to.eql("patched title"); pm.expect(p.id).to.eql(1); });'],
        { title: 'patched title' }),
      req('DELETE post', 'DELETE', '/posts/1', [status(200)])
    ]},
    { name: 'Users', item: [
      req('GET all users', 'GET', '/users', [status(200), json,
        'const u = pm.response.json();',
        'pm.test("Returns 10 users", () => pm.expect(u).to.have.lengthOf(10));',
        'pm.test("Emails look valid", () => u.forEach(x => pm.expect(x.email).to.match(/^[^@ ]+@[^@ ]+[.][^@ ]+$/)));',
        'pm.test("User ids are unique", () => pm.expect(new Set(u.map(x => x.id)).size).to.eql(u.length));']),
      req('GET single user with nested objects', 'GET', '/users/1', [status(200),
        'const u = pm.response.json();',
        'pm.test("Has address with geo", () => { pm.expect(u.address).to.be.an("object"); pm.expect(u.address.geo).to.have.all.keys("lat","lng"); });',
        'pm.test("Has company name", () => pm.expect(u.company.name).to.be.a("string").and.not.empty);'])
    ]},
    { name: 'Comments', item: [
      req('GET comments for a post', 'GET', '/posts/1/comments', [status(200),
        'const c = pm.response.json();',
        'pm.test("Comments belong to post 1", () => { pm.expect(c).to.not.be.empty; c.forEach(x => pm.expect(x.postId).to.eql(1)); });']),
      req('GET comments by query postId', 'GET', '/comments?postId=2', [status(200),
        'pm.test("Same result shape as nested route", () => pm.response.json().forEach(x => pm.expect(x.postId).to.eql(2)));'])
    ]}
  ]
};
fs.writeFileSync('JSONPlaceholder.postman_collection.json', JSON.stringify(collection, null, 2));
console.log('ok');
