### monaco-sqlpad
#### 基于微软vscode开源的monaco-editor的sql编辑器，支持SQL语法高亮、提示，支持表名、字段提示
### 示例
![preview.gif](https://upload-images.jianshu.io/upload_images/11287122-31aabe9832be213f.gif?imageMogr2/auto-orient/strip)

### 安装
```bash
npm i monaco-sqlpad --save
```

### webpack配置
```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [new CopyWebpackPlugin(
      {
        patterns: [
          {
            context: 'node_modules/monaco-sqlpad/dist/',
            from: '*.umd.min.*.js',
            to: 'js/',
            toType: 'dir'
          },
          {
            from: 'node_modules/monaco-sqlpad/dist/editor.worker.js',
            to: 'editor.worker.js',
            toType: 'file'
          },
          {
            context: 'node_modules/monaco-sqlpad/dist/',
            from: 'fonts',
            to: 'js/fonts',
            toType: 'dir'
          }
        ]
      }
    )]
  }
}
```

[为何需要配置webpack?](https://www.jianshu.com/p/033713c39ef9)

### 使用
```javascript
<template>
  <div style="height:500px">
    <monaco-sqlpad v-model="content" :on-input-field="onInputField" :dbs="dbs" :width="500" :height="500" />
  </div>
</template>
<script>
import MonacoSqlpad from 'monaco-sqlpad'
export default {
  data() {
    return {
      content: null,
      dbs: []
    }
  },
  components: {
    MonacoSqlpad
  },
  async mounted() {
    // 初始化数据库及表信息用于编辑器提示数据库和表
    this.dbs = await this.getDbList()
  },
  methods: {
    /
     * 当用户需要输入表字段时回调方法
     * @return { Array } 表格字段数组
     */
    async onInputField() {
      const fields = await this.getTableCloumn()
      return fields
    },
    /**
     * 模拟异步获取数据库名&&表名
     */
    getDbList() {
      return new Promise((resolve, reject) => {
        resolve([
        {
          dbName: 'db_bar',
          tables: [
            {
              tblName: 'user',
              tableColumns: [
                {
                  fieldName: 'username'
                }
              ]
            },
            {
              tblName: 'log',
              tableColumns: []
            },
            {
              tblName: 'goods',
              tableColumns: []
            }
          ]
        },
        {
          dbName: 'db_foo',
          tables: [
            {
              tblName: 'price',
              tableColumns: []
            },
            {
              tblName: 'time',
              tableColumns: []
            },
            {
              tblName: 'updata_user',
              tableColumns: []
            }
          ]
        }
      ])
      })
    },
    /**
     * 模拟异步获取表字段
     */
    getTableCloumn() {
      return new Promise((resolve, reject) => {
        resolve(['username', 'password'])
      })
    }
  }
}
</script>

```

## future

future |
---------|
 单元测试 |
 Event配置 |
 Option配置 |
 SQL解析优化 目前使用正则匹配表名和字段|
