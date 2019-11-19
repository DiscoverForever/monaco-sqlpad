import MonacoSqlpad from './App';

/* istanbul ignore next */
MonacoSqlpad.install = function(Vue) {
  Vue.component(MonacoSqlpad.name, MonacoSqlpad);
};

export default MonacoSqlpad;