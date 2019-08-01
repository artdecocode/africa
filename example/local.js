import africa from '../src'
import { userInfo } from 'os'

(async () => {
  try {
    const config = await africa('africa', {
      name: {
        defaultValue: userInfo().username,
        text: 'user',
      },
    }, { force: true, local: true })
    console.log(config)
  } catch ({ stack }) {
    console.log(stack)
  }
})()
