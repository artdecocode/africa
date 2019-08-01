import TempContext from 'temp-context'
import makeTestSuite from '@zoroaster/mask'

// export default
makeTestSuite('test/result/default', {
  context: TempContext,
  fork: {
    module: 'test/fixture/alamode',
  },
})