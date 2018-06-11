import africa from '../../src'

process.on('message', async ({ packageName, questions }) => {
  await africa(packageName, questions)
  process.exit()
})
