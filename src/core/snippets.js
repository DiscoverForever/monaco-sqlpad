import { keywords } from './keywords'

export default class Snippets {
  constructor (monaco, customKeywords = [], dbSchema = { dbName: '', tables: [] }) {
    this.SORT_TEXT = {
      Table: '0',
      Column: '1',
      Keyword: '2',
      Database: '3'
    }
    this.customKeywords = customKeywords
    this.dbKeywords = [...keywords, ...customKeywords]
    this.dbSchema = dbSchema
    this.monaco = monaco
    this.getKeywordSuggest = this.getKeywordSuggest.bind(this)
    this.getTableSuggest = this.getTableSuggest.bind(this)
    this.getTableSuggestColumn = this.getTableSuggestColumn.bind(this)
  }

  /**
   * 动态设置数据库表&&数据库字段
   * @param {*} dbSchema 数据库schema
   * @example
   * {
   *  dbName: 'test',
   *  tables: {
   *    user: [
   *       { name: 'user_id', type: 'varchar' },
   *       { name: 'user_name', type: 'varchar' }
   *    ],
   *    log: [
   *      { name: 'log_id', type: 'varchar' },
   *      { name: 'user_id', type: 'varchar' }
   *    ]
   *  }
   * }
   */
  setDbSchema (dbSchema) {
    this.dbSchema = dbSchema
  }

  /**
   * monaco提示方法
   * @param {*} model
   * @param {*} position
   */
  provideCompletionItems (model, position) {
    const { lineNumber, column } = position
    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: 0,
      endLineNumber: lineNumber,
      endColumn: column
    })
    const tokens = textBeforePointer.trim().split(/\s+/)
    const lastToken = tokens[tokens.length - 1].toLowerCase()

    if (lastToken === 'database') {
      return {
        suggestions: this.getDataBaseSuggest()
      }
    } else if (lastToken === 'from' || lastToken === 'join') {
      return {
        suggestions: Object.keys(this.dbSchema.tables).map(this.getTableSuggest)
      }
    } else if (lastToken === 'select') {
      return {
        suggestions: this.getAllTableColumnCompletionItems()
      }
    } else if (this.customKeywords.toString().includes(lastToken)) {
      return {
        suggestions: this.getCustomSuggest()
      }
    } else {
      const suggestions = Object.keys(this.dbSchema.tables)
        .map(this.getTableSuggest)
        .concat(this.getAllTableColumnCompletionItems())
        .concat(this.dbKeywords.map(this.getKeywordSuggest))
      return {
        suggestions: suggestions
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
  getAllTableColumnCompletionItems () {
    const tableColumns = []
    Object.keys(this.dbSchema.tables).forEach(table => {
      this.dbSchema.tables[table].forEach(column => {
        tableColumns.push(this.getTableSuggestColumn(table, column))
      })
    })
    return tableColumns
  }

  /**
   * 获取数据库库名联想建议
   */
  getDataBaseSuggest () {
    return [{
      label: this.dbSchema.dbName,
      kind: this.monaco.languages.CompletionItemKind.Keyword,
      detail: `<database>`,
      sortText: this.SORT_TEXT.Database,
      insertText: this.dbSchema.dbName
    }]
  }

  /**
   * 获取关键字联想建议
   * @param {*} keyword
   */
  getKeywordSuggest (keyword) {
    return {
      label: keyword,
      kind: this.monaco.languages.CompletionItemKind.Keyword,
      detail: '',
      sortText: this.SORT_TEXT.Keyword,
      // Fix插入两个$符号
      insertText: keyword.startsWith('$') ? keyword.slice(1) : keyword
    }
  }

  /**
   * 获取数据库表名建议
   * @param {*} name
   */
  getTableSuggest (name) {
    return {
      label: name,
      kind: this.monaco.languages.CompletionItemKind.Module,
      detail: '<table>',
      sortText: this.SORT_TEXT.Table,
      insertText: name
    }
  }

  /**
   * 获取所有表字段
   * @param {*} table
   * @param {*} column
   */
  getTableSuggestColumn (table, column) {
    return {
      label: column.name,
      kind: this.monaco.languages.CompletionItemKind.Field,
      detail: `<column> ${column.type} ${table}`,
      sortText: this.SORT_TEXT.Column,
      insertText: column.name
    }
  }
}
