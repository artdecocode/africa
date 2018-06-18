
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
