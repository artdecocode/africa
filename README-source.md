# africa

[![npm version](https://badge.fury.io/js/africa.svg)](https://badge.fury.io/js/africa)

<a href="https://npmjs.org/packages/africa">
    <img src="./africa.jpg" alt="Africa" />
</a>

`africa` is a Node.js package which simplifies reading from and writing to persistent configuration files in user's home directory. If a configuration exists, it will be read, and if not, the user will be presented with questions, after which the answers will be stored in the `.rc` file.

```sh
yarn add -E africa
```

## Table of Contents

%TOC%

## API

The package can be used via its Node.js API.

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

### `Config Type`

Any additional functionality can be configured via the config object.

```table
[
  ["Property", "Default", "Description"],
  ["`force`", "`false`", "Ask questions and update the configuration file even if it already exists."],
  ["`homedir`", "`os.homedir()`", "In which directory to save and search for configuration file."],
  ["`homedir`", "`p => p + '.rc'`", "How to generate the configuration file name. For example, to save as a JSON file, use the following: `packageName => packageName + '.json'`"]
]
```

```### async update => Object
[
  ["packageName", "string"],
  ["properties", "object"],
  ["config?", {
    "homedir?": ["string"],
    "rcNameFunction?": ["function"]
  }]
]
```

Updates the configuration properties in the `.rc` file. It will extend and override the original config with the passed object.

---

(c) [Art Deco Code][1] 2018

image [Diana Robinson][3], 2017

[1]: https://artdeco.bz
[2]: https://www.npmjs.com/package/reloquent
[3]: https://www.flickr.com/photos/dianasch/31316774424/in/photolist-PHmDYC-moFj48-Q4Aya5-63Gpiw-mLTkJi-VNKhAn-Rz3Mrh-62BZoA-5q9HuM-6cnt7G-5Jv17M-zn5DFn-5QA73Q-6xjraT-aqGVsL-odrGp-azaw9g-wJQZ9M-4nGawg-4rHcYe-atRxbW-5JYiwy-eki9WF-ahdLm5-aTm2jZ-bp9exn-9xL37X-NBPkZ9-38Exqu-69Wv9G-7yxhvg-8GsnfW-agEC2n-svkzJf-k1ihc6-pPd9Aj-5SuyNP-aAg4Gf-DAMWZ1-DHceLL-oCxZ7U-pQe8E4-y875RB-c21GHN-dNZXJ3-NJ5yVx-e663y6-e6bFDq-jYo6Sm-cem5Xu
