export  const routes = [
    {
      path:"/login",
      name:"Login",
      component: r => require(['../views/Login.vue'],r)
    },
    {
        path:"/main",
        name:"Main",
        component: r => require(['../views/Main.vue'],r),

        children:[
            {
                path:"my",
                name:"My",
                component: r => require(['../views/mainViews/My.vue'],r)
            },
            {
                path:"home",
                name:"Home",
                component: r => require(['../views/mainViews/Home.vue'],r)
            },
            {
                path:"menu",
                name:"Menu",
                component: r => require(['../views/mainViews/Menu.vue'],r)
            },
            {
                path:"shoppingbag",
                name:"Shoppingbag",
                component: r => require(['../views/mainViews/Shoppingbag.vue'],r)
            },
        ]
    },
    {
        path:'/detail',
        name:'Detail',
        component: r => require(['../views/Detail.vue'],r)
    },
    {
        path:'/pay',
        name:'Pay',
        component: r => require(['../views/Pay.vue'],r)
    },
    {
        path:'/newaddress',
        name:'NewAddress',
        component: r => require(['../views/NewAddress.vue'],r)
    },
    {
        path:'/address',
        name:'Address',
        component: r => require(['../views/Address.vue'],r)
    },
    {
        path:'/account',
        name:'Account',
        component: r => require(['../views/Account.vue'],r)
    },
    {
        path:'/order',
        name:'Order',
        component: r => require(['../views/Order.vue'],r)
    },
    {
        path:'/like',
        name:'Like',
        component: r => require(['../views/Like.vue'],r)
    },
    {
        path:'/secure',
        name:'Secure',
        component: r => require(['../views/Secure.vue'],r)
    },
    {
        path:'/forgot',
        name:'Forgot',
        component: r => require(['../views/Forgot.vue'],r)
    },
    {
        path:'/search',
        name:'Search',
        component: r => require(['../views/Search.vue'],r)
    },
    {
        path:'*',
        redirect:{
            name:'Home'
        }
    }

]