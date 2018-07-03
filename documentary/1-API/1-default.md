
```### async africa => Object
[
  ["packageName", "string"],
  ["questions", "object"],
  ["config?", {
    "force?": ["boolean"],
    "homedir?": ["string"],
    "questionsTimeout?": ["number"],
    "local?": ["boolean"],
    "rcNameFunction?": ["function"]
  }, "AfricaConfig"]
]
```

Call `africa` asynchronously to read or create a new configuration. Questions should adhere to the [`reloquent`][2]'s interface.

```table
[
  ["Argument", "Description"],
  ["`packageName`", "Name of the package which uses `africa`. It will be used when generating a name for the `.rc` file."],
  ["`questions`", "An object with questions answers to which will be saved into the `.rc` file."],
  ["`config`", "Additional configuration parameters, see [`AfricaConfig` Type](#africaconfig-type)."]
]
```

%EXAMPLE: example/example.js, ../src => africa, javascript%

```sh
user: [zavr]
{ name: 'zavr' }
```