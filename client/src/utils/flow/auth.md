#

# Sign Up

## Register Form

- firstName, lastName, email, mobile, password, password match

### ==> onSubmit

- authActions: registerUser
- POST: api/user/register

```JSON RETURN
{
  "user": {
    "\_id": "5cbbbac3a7a40c94c5c33ea4",
    "email": "mail@farm.com",
    "password": "$2a$10\$JEevn9sZYlXll2F6cJv/yunt3rnep3BxKj750uz9IkjLWUsq9pSda",
    "createdAt": "2019-04-21T00:35:15.851Z",
    "updatedAt": "2019-04-21T00:35:15.851Z",
    "**v": 0
  },
  "profile": {
    "admin": false,
    "active": true,
    "\_id": "5cbbbac4a7a40c94c5c33ea5",
    "user": "5cbbbac3a7a40c94c5c33ea4",
    "firstName": "George",
    "lastName": "Hanks",
    "mobile": 412453828,
    "position": "chef",
    "venues": [],
    "ingredients": [],
    "createdAt": "2019-04-21T00:35:16.156Z",
    "updatedAt": "2019-04-21T00:35:16.156Z",
    "**v": 0
  }
}
```

## @redirect - /Login

#

# Login

## Login Form

- email, password

### ==> onSubmit

- authActions: loginUser
- POST: /api/user/login

```JSON RETURN
  {
    "success": true,
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjYWJkMjQ4ZGJkNTM1MWQyZThjNGRkNCIsImlhdCI6MTU1NTczMjA3NCwiZXhwIjoxNTU1ODE4NDc0fQ.U99fIXukKmpqfa8baOkx8stTGgCt1MEq-r_7HNsaPvA"
  }
```

## @redirect - /Dashboard

#

# Admin Navbar

- Recipe Revenue /dashboard
- Add Recipe /add-recipe
- Username /profile

#

# Dashboard

## Links

- Add Recipe
- Recipes
- Ingredients
- Packaging

# Ingredients

## Userflow

- Enter ingredient name
- Display select list with ingredient names
- select ingredient from list

  🔥 With ingredient form displaying

  - packageGrams
  - packageCost
  - preferredSupplier is preselected and showing amounts relevant to the user profile
