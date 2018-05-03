import _ from 'lodash'
import { Factory } from './Rbac.js'
export default {
  bind: (fpm) => {

    fpm.registerAction('BEFORE_SERVER_START', () => {
      const rbacFactory = Factory(fpm)
      fpm.rbacFactory = rbacFactory
    })

  }
}
