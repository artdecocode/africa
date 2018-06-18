
```### async africa => Object
[
  ["packageName", "string"],
  ["questions", "object"],
  ["config?", {
    "force?": ["boolean"],
    "homedir?": ["string"],
    "rcNameFunction?": ["function"]
  }]
]
```

Call `africa` asynchronously to read or create a new configuration. Questions should adhere to the [`reloquent`][2]'s interface.

```table
[
  ["Argument", "Description"],
  ["`packageName`", "Name of the package which uses `africa`. It will be used when generating a name for the `.rc` file."],
  ["`questions`", "An object with questions answers to which will be saved into the `.rc` file."],
  ["`Config`", "Additional configuration parameters, see [Config Object](#config-object)."]
]
```

```js
import africa from 'africa'
import { userInfo } from 'os'

(async () => {
  try {
    const config = await africa('africa', {
      name: {
        defaultValue: userInfo().username,
        text: 'user',
      },
    }, { force: true })
    console.log(config)
  } catch ({ stack }) {
    console.log(stack)
  }
})()
```
