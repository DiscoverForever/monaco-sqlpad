<template>
  <div id="container" />
</template>

<script>
import * as monaco from 'monaco-editor'
import SQLSnippets from '@/core/snippets'
export default {
  name: 'App',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      monacoEditor: null,
      sqlSnippets: null
    }
  },
  async mounted() {
    this.initEditor()
    const dbSchema = await this.getDbSchema()
    this.sqlSnippets.setDbSchema(dbSchema)
  },
  methods: {
    /**
     * 初始化编辑器
     */
    initEditor() {
      // 实例化snippets
      this.sqlSnippets = new SQLSnippets(monaco, ['${ }'])
      // 设置编辑器主题
      // monaco.editor.setTheme('vs-dark')
      // 设置编辑器语言
      monaco.languages.registerCompletionItemProvider('sql', {
        triggerCharacters: [' ', '.', '$'],
        provideCompletionItems: (model, position) =>
          this.sqlSnippets.provideCompletionItems(model, position)
      })
      // 初始化编辑器
      this.monacoEditor = monaco.editor.create(
        document.getElementById('container'),
        {
          value: this.value,
          language: 'sql',
          minimap: {
            enabled: true
          },
          suggestOnTriggerCharacters: true
        }
      )
      // //监听变化
      this.monacoEditor.onDidChangeModelContent(e => {
        this.caretOffset = e.changes[0].rangeOffset // 获取光标位置
        this.$emit('input', this.monacoEditor.getValue())
      })
    },
    /**
     * 获取数据库表及表字段
     */
    getDbSchema() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            dbName: 'test',
            tables: {
              user: [
                {
                  name: 'username',
                  type: 'varchar'
                },
                {
                  name: 'password',
                  type: 'varchar'
                }
              ],
              goods: [
                {
                  name: 'price',
                  type: 'varchar'
                },
                {
                  name: 'origin_price',
                  type: 'varchar'
                }
              ],
            }
          })
        }, 200)
      })
    }
  }
}
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}
#container {
  width: 100%;
  height: 100%;
}
</style>
