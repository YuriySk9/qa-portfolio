# Sample test cases: SauceDemo online store

**Application under test:** https://www.saucedemo.com (public demo shop made for testing practice)
**Scope:** Login, product catalog, cart, checkout
**Type:** Manual functional tests, designed from the visible requirements of the site
**Note:** This is a sample work to show how I design test coverage. Test cases are written but not tied to a specific release.

Demo users (published on the login page): `standard_user`, `locked_out_user`, password `secret_sauce`.

Priority: **H** high, **M** medium, **L** low.

## 1. Login

| ID | Title | Steps | Expected result | Prio |
|----|-------|-------|-----------------|------|
| LG-01 | Login with valid credentials | 1. Open login page. 2. Enter `standard_user` / `secret_sauce`. 3. Click Login. | User lands on the Products page. | H |
| LG-02 | Login with wrong password | Enter `standard_user` / `wrong`. Click Login. | Error "Username and password do not match any user in this service". User stays on login page. | H |
| LG-03 | Login with empty username | Leave username empty, enter password. Click Login. | Error "Username is required". | H |
| LG-04 | Login with empty password | Enter username, leave password empty. Click Login. | Error "Password is required". | H |
| LG-05 | Locked-out user cannot log in | Enter `locked_out_user` / `secret_sauce`. Click Login. | Error "Sorry, this user has been locked out". | H |
| LG-06 | Direct access to inventory without login | Open `/inventory.html` in a new session. | Access denied, error shown on login page. | H |
| LG-07 | Logout | Log in. Open menu. Click Logout. | User returns to login page. Back button does not reopen the Products page as logged in. | M |
| LG-08 | Username is case sensitive | Enter `STANDARD_USER` / `secret_sauce`. | Login rejected. | L |
| LG-09 | Error message can be closed | Trigger any login error. Click the X on the message. | Message disappears. | L |

## 2. Product catalog

| ID | Title | Steps | Expected result | Prio |
|----|-------|-------|-----------------|------|
| PR-01 | Catalog shows all products | Log in. | 6 products shown, each with image, name, description, price, Add to cart button. | H |
| PR-02 | Sort by name A to Z | Choose "Name (A to Z)". | Products sorted alphabetically ascending. | M |
| PR-03 | Sort by name Z to A | Choose "Name (Z to A)". | Products sorted alphabetically descending. | M |
| PR-04 | Sort by price low to high | Choose "Price (low to high)". | Prices ascending. | M |
| PR-05 | Sort by price high to low | Choose "Price (high to low)". | Prices descending. | M |
| PR-06 | Open product details | Click a product name. | Details page shows the same name, description and price as the catalog. | M |
| PR-07 | Back to products from details | On details page click "Back to products". | Catalog is shown. | L |
| PR-08 | Product images match products | Check every image against product name. | Each image corresponds to its product. | M |

## 3. Cart

| ID | Title | Steps | Expected result | Prio |
|----|-------|-------|-----------------|------|
| CT-01 | Add one product | Click "Add to cart" on one product. | Button changes to "Remove". Cart badge shows 1. | H |
| CT-02 | Add several products | Add 3 products. | Badge shows 3. Cart page lists 3 items. | H |
| CT-03 | Remove product from catalog page | Add a product, click "Remove". | Badge disappears or decreases. Button returns to "Add to cart". | H |
| CT-04 | Remove product from cart page | Add a product, open cart, click Remove. | Item removed from the list. Badge updates. | H |
| CT-05 | Cart contents survive page navigation | Add item, open details, go back. | Item still in cart, button still says "Remove". | M |
| CT-06 | Cart contents persist after re-login | Add item, logout, login again. | Record observed behavior and compare with expectation (cart saved or cleared). | M |
| CT-07 | Continue shopping | Open cart, click "Continue Shopping". | Catalog is shown with the cart unchanged. | L |
| CT-08 | Empty cart checkout | Open empty cart, click Checkout. | Record observed behavior. A purchase with zero items should not be possible. | H |

## 4. Checkout

| ID | Title | Steps | Expected result | Prio |
|----|-------|-------|-----------------|------|
| CH-01 | Successful checkout | Add item. Cart. Checkout. Enter first name, last name, postal code. Continue. Finish. | Overview shows correct items and totals. Confirmation "Thank you for your order". Cart is empty. | H |
| CH-02 | First name required | Leave first name empty. Continue. | Error "First Name is required". | H |
| CH-03 | Last name required | Leave last name empty. Continue. | Error "Last Name is required". | H |
| CH-04 | Postal code required | Leave postal code empty. Continue. | Error "Postal Code is required". | H |
| CH-05 | Price calculation | Add 2 products of known price. Reach overview. | Item total equals sum of prices. Total equals item total plus tax. | H |
| CH-06 | Overview lists correct items | Add 2 products. Reach overview. | Same products and quantities as in the cart. | H |
| CH-07 | Cancel on checkout step one | Click Cancel. | Returns to cart, items preserved. | M |
| CH-08 | Cancel on overview | Click Cancel. | Returns to catalog, items preserved. | M |
| CH-09 | Special characters in form | Enter `<script>alert(1)</script>` as first name. Continue. | Input handled as text, no script runs. | M |
| CH-10 | Very long values in form | Enter 300 characters in each field. | No crash, no broken layout. Record behavior. | L |
| CH-11 | Back to products after order | After confirmation, click "Back Home". | Catalog shown, cart empty. | L |

## 5. Cross-cutting checks

| ID | Title | Expected result | Prio |
|----|-------|-----------------|------|
| XC-01 | Chrome, Firefox, Edge latest versions | All scenarios above behave the same. | M |
| XC-02 | Window resized to mobile width (375 px) | Layout usable, nothing overlaps or is cut off. | M |
| XC-03 | Keyboard navigation (Tab, Enter) | Login and checkout form can be completed without a mouse. | L |

## Coverage summary

| Area | Test cases | High priority |
|------|-----------:|--------------:|
| Login | 9 | 6 |
| Catalog | 8 | 1 |
| Cart | 8 | 5 |
| Checkout | 11 | 6 |
| Cross-cutting | 3 | 0 |
| **Total** | **39** | **18** |

## Approach

- High priority cases cover the path that earns money (login, add to cart, pay) and the most likely failures.
- Each case has one purpose and a checkable expected result, so any tester gets the same verdict.
- Where the correct behavior is not defined by the site, the case says "record observed behavior" and is flagged for clarification with the product owner. I do not guess requirements.
