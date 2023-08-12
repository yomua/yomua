const IndexedDBSymbol = Symbol()

type Data = { filepath: string; file: string }

class SingletonIndexedDB {
    static indexedDBInstance: SingletonIndexedDB
    private db: IDBDatabase
    private dbName: string
    private dbVersion: number
    private dbStoreName: string
    private specifyKey: string

    constructor(symbol: symbol) {
        if (symbol !== IndexedDBSymbol) {
            throw new Error('意外的重复初始化 IndexedDB')
        }

        this.db = null as any
        this.dbName = ''
        this.dbVersion = 1
        this.dbStoreName = ''
        this.specifyKey = ''
    }

    static get instance() {
        if (!this.indexedDBInstance) {
            this.indexedDBInstance = new SingletonIndexedDB(IndexedDBSymbol)
        }

        return this.indexedDBInstance
    }

    private getObjectStore(
        dbStoreName: string,
        mode: 'readonly' | 'readwrite' | 'versionchange',
    ) {
        return this.db.transaction(dbStoreName, mode).objectStore(dbStoreName)
    }

    open(options?: {
        specifyKey?: string // 用来通过此 key 进行 get, delete
        dbName?: string
        dbVersion?: number
        dbStoreName?: string
    }) {
        const {
            specifyKey = 'filepath',
            dbName = 'yomuaDB',
            dbVersion = 1,
            dbStoreName = 'yomua',
        } = options ?? {}

        this.dbName = dbName
        this.dbVersion = dbVersion
        this.dbStoreName = dbStoreName
        this.specifyKey = specifyKey

        const req = window.indexedDB.open(dbName, dbVersion)

        req.onupgradeneeded = (event: any) => {
            const store = event?.currentTarget?.result.createObjectStore(
                dbStoreName,
                {
                    keyPath: 'id',
                    autoIncrement: true,
                },
            )

            store.createIndex(this.specifyKey, this.specifyKey, {
                unique: true,
            })
        }

        req.onsuccess = () => {
            // Better use "this" than "req" to get the result to avoid problems with garbage collection.
            // 但是使用 class 方法比较麻烦，这里就直接使用 req.result
            // db = this.result;
            this.db = req.result

            // 不能这么做，事务将会在 onsuccess 结束后就被关闭
            // 参见：https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB#%E5%90%91%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B8%AD%E5%A2%9E%E5%8A%A0%E6%95%B0%E6%8D%AE
            // this.store = this.getObjectStore(this.dbStoreName, 'readwrite')
        }
    }

    getDataFromStore(filepath: string) {
        if (!filepath) return null as any

        const store = this.getObjectStore(this.dbStoreName, 'readonly')
        const index = store.index(this.specifyKey)

        try {
            return index.get(filepath)
        } catch (e) {
            throw e
        }
    }

    addDataFromStore(filepath: string, data: Data) {
        if (!filepath) return null as any

        const store = this.getObjectStore(this.dbStoreName, 'readwrite')

        try {
            return store?.add({
                ...data,
                filepath,
            })
        } catch (e) {
            throw e
        }
    }

    deleteDataFromStore(filepath: string) {
        if (!filepath) return null as any

        const store = this.getObjectStore(this.dbStoreName, 'readwrite')

        const req = store.index(this.specifyKey)

        req.get(filepath).onsuccess = (event: any) => {
            const id = event?.target?.result?.id
            store?.delete(id)
        }
    }

    updateDataFromStore(filepath: string, updateData: string) {
        if (!filepath) return null as any

        const store = this.getObjectStore(this.dbStoreName, 'readwrite')

        const allRequest = store.getAll()

        allRequest.onsuccess = (event: any) => {
            const allData = event?.target?.result || []

            const dataToUpdate = allData.find(
                (value: Data) => value.filepath === filepath,
            )

            if (!dataToUpdate) {
                this.addDataFromStore(filepath, { filepath, file: updateData })
                return
            }

            store.put({
                ...dataToUpdate,
                file: updateData,
            })
        }
    }

    clearDataFromStore() {
        const store = this.getObjectStore(this.dbStoreName, 'readwrite')
        store.clear()
    }
}

export default SingletonIndexedDB.instance