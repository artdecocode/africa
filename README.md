# africa

[![npm version](https://badge.fury.io/js/africa.svg)](https://npmjs.org/package/africa)

<a href="https://npmjs.org/packages/africa">
    <img src="./africa.jpg" alt="Africa" />
</a>

`africa` is a _Node.JS_ package which simplifies reading from and writing to persistent configuration files in user's home directory. If a configuration exists, it will be read, and if not, the user will be presented with questions, after which the answers will be stored in the `.rc` file.

```sh
yarn add africa
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async africa(packageName: string, questions: object, config?: AfricaConfig): Object`](#async-africapackagename-stringquestions-objectconfig-force-booleanhomedir-stringquestionstimeout-numberlocal-booleanrcnamefunction-function-object)
  * [`_africa.Config`](#type-_africaconfig)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import africa from 'africa'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## `async africa(`<br/>&nbsp;&nbsp;`packageName: string,`<br/>&nbsp;&nbsp;`questions: object,`<br/>&nbsp;&nbsp;`config?: {`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`force?: boolean,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`homedir?: string,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`questionsTimeout?: number,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`local?: boolean,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`rcNameFunction?: function,`<br/>&nbsp;&nbsp;`},`<br/>`): Object`

Call `africa` asynchronously to read or create a new configuration. Questions should adhere to the [`reloquent`][2]'s interface.

|   Argument    |                                             Description                                             |
| ------------- | --------------------------------------------------------------------------------------------------- |
| `packageName` | Name of the package which uses `africa`. It will be used when generating a name for the `.rc` file. |
| `questions` | An object with questions answers to which will be saved into the `.rc` file. |
| `config` | Additional configuration parameters, see [`AfricaConfig` Type](#africaconfig-type). |

```javascript
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

<strong><a name="type-_africaconfig">`_africa.Config`</a></strong>: The configuration object to configure additional functionality.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
  <th>Default</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center">force</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>false</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>Ask questions and update the configuration file even if it already exists.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">homedir</td>
  <td><em>string</em></td>
  <td rowSpan="3"><code>os.homedir()</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>In which directory to save and search for configuration file.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">questionsTimeout</td>
  <td><em>number</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>How log to wait in ms before timing out. Will wait forever by default.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">local</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>false</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>Whether to read a local config file in the current working directory rather than in the <code>HOMEDIR</code>. When initialising, the default values will be taken from the home config if it exists so that it is easy to extend <code>.rc</code> files.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">rcNameFunction</td>
  <td><em>function(string): string</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>Function used to generate the <code>.rc</code> name. Default: packageName =&gt; <code>.${packageName}rc</code>.</td>
 </tr>
</table>



<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>

Photo [Diana Robinson][3], 2017

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a>   2019</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

[2]: https://www.npmjs.com/package/reloquent
[3]: https://www.flickr.com/photos/dianasch/31316774424/in/photolist-PHmDYC-moFj48-Q4Aya5-63Gpiw-mLTkJi-VNKhAn-Rz3Mrh-62BZoA-5q9HuM-6cnt7G-5Jv17M-zn5DFn-5QA73Q-6xjraT-aqGVsL-odrGp-azaw9g-wJQZ9M-4nGawg-4rHcYe-atRxbW-5JYiwy-eki9WF-ahdLm5-aTm2jZ-bp9exn-9xL37X-NBPkZ9-38Exqu-69Wv9G-7yxhvg-8GsnfW-agEC2n-svkzJf-k1ihc6-pPd9Aj-5SuyNP-aAg4Gf-DAMWZ1-DHceLL-oCxZ7U-pQe8E4-y875RB-c21GHN-dNZXJ3-NJ5yVx-e663y6-e6bFDq-jYo6Sm-cem5Xu