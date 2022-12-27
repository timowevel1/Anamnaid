
## API Reference

#### Login user and obtain user data

```http
  GET /patient/login
```

| Body parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `session` | `string` | JWT session token | Deprecated, to be removed
| `email` | `string` | User Email |
| `password` | `string` | User password |

Return type is a JSON with the user data including the session token to authenticate against other API request like obtaining anamnesia data

#### Register user

```http
  POST /patient/register
```

| Body parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | User email |
| `password` | `string` | User password |
| `first_name` | `string` | User first name |
| `last_name` | `string` | User last name |


#### Login doctor and obtain user data

```http
  GET /doctor/
```
TBD

#### Get anamnesia data related to a user

```http
  GET /anamnesia/
```

| Body parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `session` | `string` | JWT session token |
| `doctor` | `int` | Doctor id (optional) |

Return type is a JSON with the user anamnesia data. If a doctor id is provided,
only anamnesia data which was submitted to the provided doctor gets returned.

#### Add anamnesia data

```http
  POST /anamnesia/
```

| Body parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `session` | `string` | JWT session token |
| `doctor` | `string` | Doctor who is the receiver of the anamnesia form |
| `content` | `int` | Anamnesia form as JSON |




