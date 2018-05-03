## FPM-PLUGIN-RBAC-FS
A Rbac Plugin For FPM With FileSystem

### Install
```bash
yarn add fpm-plugin-rbac-fs
```

### Useage

```javascript
//get rbac of a roleid
// fpm.rbac.getRbac(roleid:Number) => RBAC
const rbac = await fpm.rbacFactory.getRbac(obsInfo.role_id)
```

```javascript
//get acl from rbac instance
RBAC.getAcl()
RBAC.getRole()
```
