# africa

`africa` is a Node.js package which simplifies reading from and reading from
persistent configuration files in user's home directory. If configuration
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

[1]: https://sobes.io
[2]: https://www.npmjs.com/package/reloquent
