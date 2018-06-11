const africa = require('../..')

process.on('message', async ({ packageName, questions }) => {
  await africa(packageName, questions)
  process.exit()
})
