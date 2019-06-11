import { keywords } from './keywords'

export default class Snippets {
  constructor (monaco, customKeywords = [], onInputTableName, dbSchema = [{ dbName: '', tables: [{ tableName: '', tableColumns: [] }] }]) {
    this.SORT_TEXT = {
      Database: '0',
      Table: '1',
      Column: '2',
      Keyword: '3'
    }
    this.customKeywords = customKeywords
    this.dbKeywords = [...keywords, ...customKeywords]
    this.dbSchema = dbSchema
    this.monaco = monaco
    this.getKeywordSuggest = this.getKeywordSuggest.bind(this)
    this.getTableSuggest = this.getTableSuggest.bind(this)
    this.getTableColumnSuggest = this.getTableColumnSuggest.bind(this)
    this.onInputTableName = onInputTableName
  }

  /**
   * 动态设置数据库表&&数据库字段
   * @param {*} dbSchema 数据库schema
   * @example [{ dbName: '', tables: [{ tableName: '', tableColumns: [] }] }]
   */
  setDbSchema (dbSchema) {
    this.dbSchema = dbSchema
  }

  /**
   * monaco提示方法
   * @param {*} model
   * @param {*} position
   */
  async provideCompletionItems (model, position) {
    const { lineNumber, column } = position
    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: 0,
      endLineNumber: lineNumber,
      endColumn: column
    })
    const tokens = textBeforePointer.trim().split(/\s+/)
    const lastToken = tokens[tokens.length - 1].toLowerCase()
    // 数据库名联想
    if (lastToken === 'database') {
      return {
        suggestions: this.getDataBaseSuggest()
      }
    // <库名>.<表名>联想
    } else if (this.dbSchema.find(db => `${db.dbName}.` === lastToken)) {
      return {
        suggestions: [...this.getTableSuggestByDbName(lastToken.slice(0, lastToken.length - 1))]
      }
    // 表名联想
    } else if (lastToken === 'from' || lastToken === 'join') {
      const tables = this.getTableSuggest()
      const databases = this.getDataBaseSuggest()
      return {
        suggestions: [...databases, ...tables]
      }
    // 字段联想
    } else if (lastToken === 'select') {
      return {
        suggestions: await this.getTableColumnSuggest()
      }
    // 自定义字段联想
    } else if (this.customKeywords.toString().includes(lastToken)) {
      return {
        suggestions: this.getCustomSuggest()
      }
    // 默认联想
    } else {
      return {
        suggestions: [...this.getDataBaseSuggest(), ...this.getTableSuggest(), ...this.getAllTableColumn(), ...this.getKeywordSuggest()]
      }
    }
  }

  /**
   * 获取自定义联想建议
   */
  getCustomSuggest () {
    return this.customKeywords.map(this.getKeywordSuggest)
  }

  /**
   * 获取所有字段
   */
  getAllTableColumn () {
    const tableColumns = []
    this.dbSchema.forEach(db => {
      db.tables.forEach(table => {
        table.tableColumns.forEach(field => {
          tableColumns.push({
            label: field.fieldName,
            kind: this.monaco.languages.CompletionItemKind.Module,
            detail: `<field> ${table.tableName}`,
            sortText: this.SORT_TEXT.Column,
            insertText: field.fieldName
          })
        })
      })
    })
    return tableColumns
  }

  /**
   * 获取数据库库名联想建议
   */
  getDataBaseSuggest () {
    return this.dbSchema.map(db => {
      return {
        label: db.dbName,
        kind: this.monaco.languages.CompletionItemKind.Keyword,
        detail: `<database>`,
        sortText: this.SORT_TEXT.Database,
        insertText: db.dbName
      }
    })
  }

  /**
   * 获取关键字联想建议
   * @param {*} keyword
   */
  getKeywordSuggest () {
    return this.dbKeywords.map(keyword => ({
      label: keyword,
      kind: this.monaco.languages.CompletionItemKind.Keyword,
      detail: '',
      sortText: this.SORT_TEXT.Keyword,
      // Fix插入两个$符号
      insertText: keyword.startsWith('$') ? keyword.slice(1) : keyword
    }))
  }

  /**
   * 获取数据库表名建议
   */
  getTableSuggest () {
    const tables = []
    this.dbSchema.forEach(db => {
      db.tables.forEach(table => {
        tables.push({
          label: table.tableName,
          kind: this.monaco.languages.CompletionItemKind.Module,
          detail: '<table>',
          sortText: this.SORT_TEXT.Table,
          insertText: table.tableName
        })
      })
    })
    return tables
  }

  getTableSuggestByDbName(dbName) {
    const currentDb = this.dbSchema.find(db => db.dbName === dbName)
    const tables = []
    if (currentDb) {
      currentDb.tables.forEach(table => {
        tables.push({
          label: table.tableName,
          kind: this.monaco.languages.CompletionItemKind.Module,
          detail: '<table>',
          sortText: this.SORT_TEXT.Table,
          insertText: table.tableName
        })
      })
    }
    return tables
  }
  /**
   * 获取所有表字段
   * @param {*} table
   * @param {*} column
   */
  async getTableColumnSuggest (table, column) {
    const defaultFields = []
    this.dbSchema.forEach(db => {
      db.tables.forEach(table => {
        table.tableColumns.forEach(field => {
          defaultFields.push({
            label: field.fieldName,
            kind: this.monaco.languages.CompletionItemKind.Module,
            detail: '<field>',
            sortText: this.SORT_TEXT.Column,
            insertText: field.fieldName
          }) 
        })
      })
    })
    const asyncFields = []
    if (typeof this.onInputTableName === 'function') {
      const fileds = await this.onInputTableName()
      fileds.forEach(field => {
        asyncFields.push({
          label: field,
          kind: this.monaco.languages.CompletionItemKind.Module,
          detail: '<field>',
          sortText: this.SORT_TEXT.Column,
          insertText: field
        })
      })
    }
    return [...defaultFields, ...asyncFields]
  }
}
