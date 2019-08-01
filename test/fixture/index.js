import africa from '../../src'

process.on('message', async ({ packageName, questions, config = {} }) => {
  const q = Object.keys(questions).reduce((acc, key) => {
    const val = questions[key]
    const newVal = {
      ...val,
      ...(val.getDefault ? { async getDefault() {
        return val.getDefault
      } } : {}),
    }
    return {
      ...acc,
      [key]: newVal,
    }
  }, {})
  const res = await africa(packageName, q, config)
  process.send(res)
  process.exit()
})
