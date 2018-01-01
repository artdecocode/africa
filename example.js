const { username } = require('os').userInfo()
const africa = require('.');

(async () => {
    const config = await africa('africa', {
        name: {
            async getDefault() {
                const res = await Promise.resolve(username)
                return res
            },
            text: 'user',
        },
    }, { force: true })
    console.log(config)
})().catch(console.error)
