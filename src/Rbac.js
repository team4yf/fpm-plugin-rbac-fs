const _ = require('lodash')
const fs = require('fs')
const path = require('path')

let data
class RBAC{
    constructor(role, metadata){
        this.role = role
        this.metadata = metadata
    }
    getAcl(){
        const relationship = _.values(this.metadata.relationship)
        return _.map(this.metadata.acl, ac => {
            let r = _.find(relationship, { group_id: ac.group_id})
            if(_.isEmpty(r)){
                ac.hasPermission = false
            }else{
                let {can_create, can_update, can_read, can_delete} = r
                ac = _.assign(ac, {can_create, can_update, can_read, can_delete, hasPermission: true})
            }
            return ac
        })
    }
    hasPermission(acl){
        return false
    }
    isAdmin(){
        return false
    }
    getRole(){
        return this.metadata.role
    }
    toJson(){
        return this.metadata
    }
}

const Factory = fpm => {
    const M = fpm.M
    const dataPath = path.join(fpm.get('CWD'), 'rbac.json')
    if(fs.existsSync(dataPath)){
        data = require(dataPath)
        console.log('load from rbac.json')
    }else{
        data = {
            roles: {
                '1': {
                    id: 1,
                    title: '本地管理员角色',
                    remark: '本地管理员角色'
                },
                '2': {
                    id: 2,
                    title: '通用管理员角色',
                    remark: '通用管理员角色'
                },
                '3': {
                    id: 3,
                    title: '信息中心',
                    remark: '信息中心'
                },
            },
            groups: {
                '1': {
                    id: 1,
                    title: 'LOCAL MANAGER ADMIN',
                    remark: '本地管理员，拥有最高权限'
                },
                '2': {
                    id: 2,
                    title: 'LOCAL ADMIN',
                    remark: '本地管理员，拥有后台管理权限'
                },
                '3': {
                    id: 3,
                    title: 'DEFAULT ADMIN',
                    remark: '默认管理员，拥有后台部分管理权限'
                },
                '4': {
                    id: 4,
                    title: 'DEFAULT USER',
                    remark: '默认用户组，拥有处理部分业务数据的权限'
                },
            }
            ,
            relationship: {
                '1': { id: 1, group_id: 1, role_id: 1, can_create: 1, can_read: 1, can_delete: 1, can_update: 1 },
                '2': { id: 2, group_id: 2, role_id: 1, can_create: 1, can_read: 0, can_delete: 0, can_update: 1 },
                '3': { id: 3, group_id: 3, role_id: 1, can_create: 1, can_read: 1, can_delete: 1, can_update: 1 },
                '4': { id: 4, group_id: 4, role_id: 2, can_create: 1, can_read: 1, can_delete: 1, can_update: 1 },
                '5': { id: 5, group_id: 2, role_id: 2, can_create: 1, can_read: 1, can_delete: 1, can_update: 1 },
                '6': { id: 6, group_id: 2, role_id: 2, can_create: 1, can_read: 1, can_delete: 1, can_update: 1 },
            },
            acl: {
                '1': { id: 1, name: '设备列表查看', url: '/device/list', group_id: 3},
                '2': { id: 2, name: '设备添加', url: '/device/add', group_id: 2},
                '3': { id: 3, name: '设备删除', url: '/device/delete', group_id: 1},
                '4': { id: 4, name: '设备信息编辑', url: '/device/edit', group_id: 1},
            }
        
        }
    }
    return {
        getRbac: async role => {
            try{
                if(_.has(data.roles, role)){
                    const metadata = data
                    metadata.role = data.roles[role]
                    return new RBAC(role, metadata)
                }else{
                    return Promise.reject({errno: -2, message: 'role not found'})
                }
                
            }catch(e){
                console.log(e)
                return {}
            }
            
        }
    }
}

exports.Factory = Factory



