import { RoleMgr } from "@/pages/sys/role"
import { UserMgr } from "@/pages/sys/user"

const sysRouter = [
    {
        label: '用户管理',
        path: 'UserMgr',
        submenus: true,
        element: <UserMgr />
    }
    // {
    //     label: '角色管理',
    //     path: 'RoleMgr',
    //     submenus: true,
    //     element: <RoleMgr />
    // }
]

export default sysRouter
