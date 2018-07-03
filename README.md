# africa

[![npm version](https://badge.fury.io/js/africa.svg)](https://npmjs.org/package/africa)

<a href="https://npmjs.org/packages/africa">
    <img src="./africa.jpg" alt="Africa" />
</a>

`africa` is a Node.js package which simplifies reading from and writing to persistent configuration files in user's home directory. If a configuration exists, it will be read, and if not, the user will be presented with questions, after which the answers will be stored in the `.rc` file.

```sh
yarn add -E africa
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`async africa(packageName: string, questions: object, config?: AfricaConfig): Object`](#async-africapackagename-stringquestions-objectconfig-force-booleanhomedir-stringquestionstimeout-numberlocal-booleanrcnamefunction-function-object)
  * [`AfricaConfig` Type](#africaconfig-type)
    * [<code>force</code>](#force)
    * [<code>homedir</code>](#homedir)
    * [<code>questionsTimeout</code>](#questionstimeout)
    * [<code>local</code>](#local)
    * [<code>rcNameFunction</code>](#rcnamefunction)

## API

The package can be used via its Node.js API.

### `async africa(`<br/>&nbsp;&nbsp;`packageName: string,`<br/>&nbsp;&nbsp;`questions: object,`<br/>&nbsp;&nbsp;`config?: {`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`force?: boolean,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`homedir?: string,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`questionsTimeout?: number,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`local?: boolean,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`rcNameFunction?: function,`<br/>&nbsp;&nbsp;`},`<br/>`): Object`

Call `africa` asynchronously to read or create a new configuration. Questions should adhere to the [`reloquent`][2]'s interface.

| Argument | Description |
| -------- | ----------- |
| `packageName` | Name of the package which uses `africa`. It will be used when generating a name for the `.rc` file. |
| `questions` | An object with questions answers to which will be saved into the `.rc` file. |
| `config` | Additional configuration parameters, see [`AfricaConfig` Type](#africaconfig-type). |

```javascript
/* yarn example/ */
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

```sh
user: [zavr]
{ name: 'zavr' }
```
### `AfricaConfig` Type

Any additional functionality can be configured via the config object.

<table>
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>
   <th>Example</th>
  </tr>
 </thead>
 <tbody>
   <tr>
  <td><a name="force"><code>force</code></a></td>
  <td><em>boolean</em></td>
  <td>Ask questions and update the configuration file even if it already exists. Default <code>false</code>.</td>
  <td><code>true</code></td>
 </tr>
 <tr>
  <td><a name="homedir"><code>homedir</code></a></td>
  <td><em>string</em></td>
  <td>In which directory to save and search for configuration file. Default <code>os.homedir()</code>.</td>
  <td><code>resolve('..')</code></td>
 </tr>
 <tr>
  <td><a name="questionstimeout"><code>questionsTimeout</code></a></td>
  <td><em>number</em></td>
  <td>How log to wait in ms before timing out. Will wait forever by default.</td>
  <td><code>10000</code></td>
 </tr>
 <tr>
  <td><a name="local"><code>local</code></a></td>
  <td><em>boolean</em></td>
  <td>Whether to read a local config file in the current working directory rather than in the <code>HOMEDIR</code>. When initialising, the default values will be taken from the home config if it exists so that it is easy to extend <code>.rc</code> files. <code>false</code> by default.</td>
  <td><code>true</code></td>
 </tr>
 <tr>
  <td><a name="rcnamefunction"><code>rcNameFunction</code></a></td>
  <td><em>function</em></td>
  <td>Function used to generate the rc name. Default <code>packageName => `.${packageName}rc`</code>.</td>
  <td>To save as JSON: <code>packageName => `${packageName}.json`</code></td>
 </tr>
 </tbody>
</table>


---

(c) [Art Deco][1] 2018

image [Diana Robinson][3], 2017

[1]: https://artdeco.bz
[2]: https://www.npmjs.com/package/reloquent
[3]: https://www.flickr.com/photos/dianasch/31316774424/in/photolist-PHmDYC-moFj48-Q4Aya5-63Gpiw-mLTkJi-VNKhAn-Rz3Mrh-62BZoA-5q9HuM-6cnt7G-5Jv17M-zn5DFn-5QA73Q-6xjraT-aqGVsL-odrGp-azaw9g-wJQZ9M-4nGawg-4rHcYe-atRxbW-5JYiwy-eki9WF-ahdLm5-aTm2jZ-bp9exn-9xL37X-NBPkZ9-38Exqu-69Wv9G-7yxhvg-8GsnfW-agEC2n-svkzJf-k1ihc6-pPd9Aj-5SuyNP-aAg4Gf-DAMWZ1-DHceLL-oCxZ7U-pQe8E4-y875RB-c21GHN-dNZXJ3-NJ5yVx-e663y6-e6bFDq-jYo6Sm-cem5Xu
