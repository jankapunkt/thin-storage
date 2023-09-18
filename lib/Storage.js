class Storage {
    constructor (options) {
        this.name = options.name
        this.primary = options.primary || 'id'
        this.documents = []
        this.keys = new Map()
        this.handler = options.handler
    }

    /**
     * Loads all documents from the handler into memory.
     * Use this either after construction or if you think the
     * storage is out of sync with its backend.
     * @returns {Promise<void>}
     */
    async load () {
        const options = getOptions(this)
        this.documents = await this.handler.load(options) || this.documents
        this.keys = new Map()
        this.documents.forEach((doc, index) => {
            const key = doc[this.primary]
            this.keys.set(key, index)
        })
    }

    async insert (documents) {
        const options = getOptions(this)

        let docsToInsert = documents.map(doc => ({ ...doc }))

        if (this.handler.beforeInsert) {
            await this.handler.beforeInsert(docsToInsert, options)
        }

        const primaries = await this.handler.insert(docsToInsert, options)
        docsToInsert.forEach((doc, index) => {
            const primaryValue = primaries[index]
            doc[this.primary] = primaryValue

            const keyIndex = this.documents.length
            this.keys.set(primaryValue, keyIndex)
            this.documents.push(doc)
        })

        if (this.handler.afterInsert) {
            await this.handler.afterInsert(this.documents, options)
        }

        return primaries
    }

    async find (query) {
        const queryType = typeof query

        if (queryType === 'string') {
            const index = this.keys.get(query) // query is a primary key
            return typeof index === 'number' ? this.documents[index] : undefined
        }

        if (queryType === 'function') {
            return this.documents.filter(query)
        }

        if (queryType === 'object') {
            const { looseMatching } = options
            const entries = Object.keys(query)
            const byMatcher = doc => entries.every(([key, value]) => {
                return looseMatching
                    ? doc[key] == value
                    : doc[key] === value
            })
            return this.documents.filter(byMatcher)
        }

        throw new Error(`Unsupported query type "${queryType}"`)
    }

    async update (query, document) {
        const docsToChange = await this.find(query)
        const idsToChange = docsToChange.map(doc => doc[this.primary])

        Object.entries(document).forEach(([key, value]) => {})

    }

    async remove (query) {}

}

const noOp = () => {}
const getOptions = ({ primary, documents }) => {
    return { primary, documents }
}
