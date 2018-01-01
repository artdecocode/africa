# africa

<a href="https://npmjs.org/packages/africa">
    <img src="./africa.jpg" alt="Africa" />
</a>

`africa` is a Node.js package which simplifies reading from and writing to
persistent configuration files in user's home directory. If a configuration
exists, it will be read, and if not, questions will be asked and answers stored.

```sh
npm i africa
```

## ES5

The package uses some newer language features. For your convenience, it's been
transpiled to be compatible with Node 4. You can use the following snippet.

```js
const africa = require('africa/es5/src')
```

## API

The package exports a single function.

### `async africa(packageName: string, questions: object, { force?: boolean, homedir?: string, rcNameFunction?: function }): Promise.<object>`

Call `africa` asynchronously to read or create a new configuration. Questions
should adhere to [`reloquent`][2]'s interface.

```js
const africa = require('africa');

(async () => {
    const config = await africa('package', {
        name: {
            text: 'Name: ',
            validation: a => { if (!a) throw new Error('Please enter the name') }
        }
    })
    console.log(config) // `reads config from ~/.packagerc`
})()
```

- Use `force` to ask questions and update the configuration file even if one
already exists.
- Pass `homedir` to specify in which directory to search for the configuration
file. Default is user's home directory.
- Customise the name of the configuration file with with `rcNameFunction`, e.g.,
`packageName => packageName + '.json'`

---

(c) [sobes.io][1] 2018

image [Diana Robinson][3], 2017

[1]: https://sobes.io
[2]: https://www.npmjs.com/package/reloquent
[3]: https://www.flickr.com/photos/dianasch/31316774424/in/photolist-PHmDYC-moFj48-Q4Aya5-63Gpiw-mLTkJi-VNKhAn-Rz3Mrh-62BZoA-5q9HuM-6cnt7G-5Jv17M-zn5DFn-5QA73Q-6xjraT-aqGVsL-odrGp-azaw9g-wJQZ9M-4nGawg-4rHcYe-atRxbW-5JYiwy-eki9WF-ahdLm5-aTm2jZ-bp9exn-9xL37X-NBPkZ9-38Exqu-69Wv9G-7yxhvg-8GsnfW-agEC2n-svkzJf-k1ihc6-pPd9Aj-5SuyNP-aAg4Gf-DAMWZ1-DHceLL-oCxZ7U-pQe8E4-y875RB-c21GHN-dNZXJ3-NJ5yVx-e663y6-e6bFDq-jYo6Sm-cem5Xu
