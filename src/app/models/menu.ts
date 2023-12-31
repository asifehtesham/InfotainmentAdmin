export const sideBarTopIcons = [
    {
        'name': 'Search',
        'icon': 'magnifying-glass',
        'link': '/mainapp/search',
        'open': false,
    },
    {
        'name': 'Calendar',
        'icon': 'calendar-days',
        'link': '/mainapp/events',
        'open': false,
    },
    {
        'name': 'Users',
        'icon': 'id-card',
        'link': '/mainapp/users',
        'open': false,
    },
    {
        'name': 'Chat',
        'icon': 'comments',
        'link': '/mainapp/chat',
        'open': false,
    },
    {
        'name': 'Folder',
        'icon': 'folder',
        'link': '/mainapp/files',
        'open': false,
    }
]

export const sideBarBottomIcons = [
    {
        'name': 'Setup',
        'icon': 'gear',
        'link': '/mainapp/settings',
        'open': false,
    },
    // {
    //     'name': 'Profile',
    //     'icon': 'id-card',
    //     'link': '/mainapp/admin/quiz',
    //     'open': false,
    // },
    {
        'name': 'Toggle',
        'icon': 'align-left',
        'link': 'toggle',
        'open': false,
    }
]
export const menus = [
    {
        'name': 'Dashboard',
        'icon': 'chart-pie',
        'link': '/mainapp/dashboard',
        'open': false,
    },
    {
        'name': 'Rooms',
        'icon': 'hospital-alt',
        'link': '/mainapp/rooms',
        'open': false,
        'sub': [
            {
                'name': 'Manage Rooms',
                // 'icon': 'building',
                'link': '/mainapp/rooms',
                'open': false,
            },
            {
                'name': 'Manage Room Types',
                // 'icon': 'building',
                'link': '/mainapp/room-types',
                'open': false,
            },
            {
                'name': 'Manage Requests',
                //'icon': 'building',
                'link': '/mainapp/service-request',
                'open': false,
            },

            {
                'name': 'Manage Services',
                //'icon': 'building',
                'link': '/mainapp/room-service',
                'open': false,
            },
            {
                'name': 'Manage Devices',
                //'icon': 'building',
                'link': '/mainapp/device',
                'open': false,
            },
        ]
    },
    {
        'name': 'Nursing Station',
        'icon': 'user-nurse',
        'link': '/mainapp/nurse-station',
        'open': false,
        'sub': [
            {
                'name': 'Nursing Station',
                'icon': 'user-nurse',
                'link': '/mainapp/nurse-station',
                'open': false,
            },
            {
                'name': 'Service Request',
                'icon': 'concierge-bell',
                'link': '/mainapp/nursing-service-request',
                'open': false,
            },
        ]
    }, 
    {
        'name': 'Branches',
        'icon': 'code-branch',
        'link': '/mainapp/branch',
        'open': false,
        'sub': [
            {
                'name': 'Manage Branches',
                '//icon': 'rss',
                'link': '/mainapp/branch',
                'open': false,
            },

            {
                'name': 'Manage Floor',
                //'icon': 'rss',
                'link': '/mainapp/floor',
                'open': false,
            },


        ]
    },
    {
        'name': 'Entertainment',
        'icon': 'rss',
        'link': '/mainapp/imenu',
        'open': false,
        'sub': [

            {
                'name': 'Menu',
                //'icon': 'newspaper',
                'link': '/mainapp/imenu',
                'open': false,
            },

            {
                'name': 'Newspaper',
                //'icon': 'newspaper',
                'link': '/mainapp/newspaper',
                'open': false,
            },
            {
                'name': 'Magazine',
                //'icon': 'newspaper',
                'link': '/mainapp/magazine',
                'open': false,
            },
            {
                'name': 'Games',
                //'icon': 'rocket',
                'link': '/mainapp/games',
                'open': false,
            },
            {
                'name': 'Feedback Type',
                //'icon': 'poll',
                'link': '/mainapp/feedbackType',
                'open': false,
            },
            {
                'name': 'Social Media Type',
                //'icon': 'photo-video',
                'link': '/mainapp/socialmediatype',
                'open': false,
            },
            {
                'name': 'Social Media',
                //'icon': 'users',
                'link': '/mainapp/socialmedia',
                'open': false,
            },


        ]
    },
    {
        'name': 'TV Channels',
        'icon': 'tv',
        'link': '/mainapp/iptv',
        'open': false,
        'sub': [

            {
                'name': 'Manage Channels',
                //'icon': 'rss',
                'link': '/mainapp/iptv',
                'open': false,
            },

            {
                'name': 'Manage Categories',
                //'icon': 'rss',
                'link': '/mainapp/iptv-category',
                'open': false,
            },

        ]
    },
    {
        'name': 'Country',
        'icon': 'flag',
        'link': '/mainapp/country',
        'open': false,
    },
    {
        'name': 'CMS',
        'icon': 'rocket',
        'link': '/mainapp/pagelist',
        //'link': '/mainapp/categories',
        'open': false,
        'sub': [
            {
                'name': 'Pages',
                //'icon': 'calendar',
                'link': '/mainapp/pagelist',
                'open': false,
            },

            {
                'name': 'Components',
                //'icon': 'calendar',
                'link': '/mainapp/componentlist',
                'open': false,
            },

            {
                'name': 'Templates',
                //'icon': 'calendar',
                'link': '/mainapp/templatelist',
                'open': false,
            },

            {
                'name': 'Banners',
                //'icon': 'dashboard',
                'link': '/mainapp/banners',
                'open': false,
            },
            {
                'name': 'Menu',
                //'icon': 'dashboard',
                'link': '/mainapp/menu',
                'open': false,
            },
        ]
    },
    {
        'name': 'Categories',
        'icon': 'list',
        'link': '/mainapp/categories',
        'open': false,
    },
    {
        'name': 'Blogs',
        'icon': 'blog',
        'link': '/mainapp/blogs',
        'open': false,
    },
    {
        'name': 'News',
        'icon': 'newspaper',
        'link': '/mainapp/news',
        'open': false,
    },
    {
        'name': 'Services',
        'icon': 'briefcase',
        'link': '/mainapp/services',
        'open': false,
    },
    {
        'name': 'Forms',
        'icon': 'edit',
        'link': '/mainapp/forms',
        'open': false,
    },
    {
        'name': 'Poll',
        'icon': 'poll',
        'link': '/mainapp/polls',
        'open': false,
    },
    {
        'name': 'Gallery',
        'icon': 'photo-video',
        'link': '/mainapp/gallery',
        'open': false,
    },
    {
        'name': 'Users',
        'icon': 'users',
        'link': '/mainapp/users',
        'open': false,
        'sub': [
            {
                'name': 'User',
                // 'icon': 'user',
                'link': '/mainapp/users',
                'open': false,
            },
            {
                'name': 'Cohort',
                'link': '/mainapp/cohort',
                'open': false,
            },
            {
                'name': 'Roles',
                'icon': 'user-unlock',
                'link': '/mainapp/roles',
                'open': false,
            },
        ]
    }
]

export const manager_menu = [
    {
        'name': 'Dashboard',
        'icon': 'chart-pie',
        'link': '/mainapp/dashboard',
        'open': false,
    },
    {
        'name': 'Rooms',
        'icon': 'hospital-alt',
        'link': '/mainapp/rooms',
        'open': false,
        'sub': [
            {
                'name': 'Manage Rooms',
                // 'icon': 'building',
                'link': '/mainapp/rooms',
                'open': false,
            },
            {
                'name': 'Manage Room Types',
                // 'icon': 'building',
                'link': '/mainapp/room-types',
                'open': false,
            },
            {
                'name': 'Manage Requests',
                //'icon': 'building',
                'link': '/mainapp/service-request',
                'open': false,
            },

            {
                'name': 'Manage Services',
                //'icon': 'building',
                'link': '/mainapp/room-service',
                'open': false,
            },
            {
                'name': 'Manage Devices',
                //'icon': 'building',
                'link': '/mainapp/device',
                'open': false,
            },
        ]
    },
    {
        'name': 'Nursing Station',
        'icon': 'user-nurse',
        'link': '/mainapp/nurse-station',
        'open': false,
        'sub': [
            {
                'name': 'Nursing Station',
                'icon': 'user-nurse',
                'link': '/mainapp/nurse-station',
                'open': false,
            },
            {
                'name': 'Service Request',
                'icon': 'concierge-bell',
                'link': '/mainapp/nursing-service-request',
                'open': false,
            },
        ]
    }, 
    {
        'name': 'Branches',
        'icon': 'code-branch',
        'link': '/mainapp/branch',
        'open': false,
        'sub': [
            {
                'name': 'Manage Branches',
                '//icon': 'rss',
                'link': '/mainapp/branch',
                'open': false,
            },

            {
                'name': 'Manage Floor',
                //'icon': 'rss',
                'link': '/mainapp/floor',
                'open': false,
            },


        ]
    },
    {
        'name': 'Entertainment',
        'icon': 'rss',
        'link': '/mainapp/imenu',
        'open': false,
        'sub': [

            {
                'name': 'Menu',
                //'icon': 'newspaper',
                'link': '/mainapp/imenu',
                'open': false,
            },

            {
                'name': 'Newspaper',
                //'icon': 'newspaper',
                'link': '/mainapp/newspaper',
                'open': false,
            },
            {
                'name': 'Magazine',
                //'icon': 'newspaper',
                'link': '/mainapp/magazine',
                'open': false,
            },
            {
                'name': 'Games',
                //'icon': 'rocket',
                'link': '/mainapp/games',
                'open': false,
            },
            {
                'name': 'Feedback Type',
                //'icon': 'poll',
                'link': '/mainapp/feedbackType',
                'open': false,
            },
            {
                'name': 'Social Media Type',
                //'icon': 'photo-video',
                'link': '/mainapp/socialmediatype',
                'open': false,
            },
            {
                'name': 'Social Media',
                //'icon': 'users',
                'link': '/mainapp/socialmedia',
                'open': false,
            },


        ]
    },
    {
        'name': 'TV Channels',
        'icon': 'tv',
        'link': '/mainapp/iptv',
        'open': false,
        'sub': [

            {
                'name': 'Manage Channels',
                //'icon': 'rss',
                'link': '/mainapp/iptv',
                'open': false,
            },

            {
                'name': 'Manage Categories',
                //'icon': 'rss',
                'link': '/mainapp/iptv-category',
                'open': false,
            },

        ]
    },
    {
        'name': 'Country',
        'icon': 'flag',
        'link': '/mainapp/country',
        'open': false,
    },
    {
        'name': 'CMS',
        'icon': 'rocket',
        'link': '/mainapp/pagelist',
        //'link': '/mainapp/categories',
        'open': false,
        'sub': [
            {
                'name': 'Pages',
                //'icon': 'calendar',
                'link': '/mainapp/pagelist',
                'open': false,
            },

            {
                'name': 'Components',
                //'icon': 'calendar',
                'link': '/mainapp/componentlist',
                'open': false,
            },

            {
                'name': 'Templates',
                //'icon': 'calendar',
                'link': '/mainapp/templatelist',
                'open': false,
            },

            {
                'name': 'Banners',
                //'icon': 'dashboard',
                'link': '/mainapp/banners',
                'open': false,
            },
            {
                'name': 'Menu',
                //'icon': 'dashboard',
                'link': '/mainapp/menu',
                'open': false,
            },
        ]
    },
    {
        'name': 'Categories',
        'icon': 'list',
        'link': '/mainapp/categories',
        'open': false,
    },
    {
        'name': 'Blogs',
        'icon': 'blog',
        'link': '/mainapp/blogs',
        'open': false,
    },
    {
        'name': 'News',
        'icon': 'newspaper',
        'link': '/mainapp/news',
        'open': false,
    },
    {
        'name': 'Services',
        'icon': 'briefcase',
        'link': '/mainapp/services',
        'open': false,
    },
    {
        'name': 'Forms',
        'icon': 'edit',
        'link': '/mainapp/forms',
        'open': false,
    },
    {
        'name': 'Poll',
        'icon': 'poll',
        'link': '/mainapp/polls',
        'open': false,
    },
    {
        'name': 'Gallery',
        'icon': 'photo-video',
        'link': '/mainapp/gallery',
        'open': false,
    },
    {
        'name': 'Users',
        'icon': 'users',
        'link': '/mainapp/users',
        'open': false,
        'sub': [
            {
                'name': 'User',
                // 'icon': 'user',
                'link': '/mainapp/users',
                'open': false,
            },
            {
                'name': 'Cohort',
                'link': '/mainapp/cohort',
                'open': false,
            },
            {
                'name': 'Roles',
                'icon': 'user-unlock',
                'link': '/mainapp/roles',
                'open': false,
            },
        ]
    }
]
export const nurse_Menu = [
    // {
    //     'name': 'Dashboard',
    //     'icon': 'chart-pie',
    //     'link': '/mainapp/dashboard',
    //     'open': false,
    // },
    {
        'name': 'Nursing Station',
        'icon': 'user-nurse',
        'link': '/mainapp/nurse-station',
        'open': false,
    },
    {
        'name': 'Service Request',
        'icon': 'concierge-bell',
        'link': '/mainapp/nursing-service-request',
        'open': false,
    },
]

export const siteadminmenus = [
    {
        'name': 'Categories',
        'icon': 'list',
        'link': '/mainapp/admin/category',
        'open': false,
    },
    {
        'name': 'Courses',
        'icon': 'book',
        'link': '/mainapp/admin/course',
        'open': false,
    },
    {
        'name': 'Quiz',
        'icon': 'book',
        'link': '/mainapp/admin/quiz',
        'open': false,
    },
    {
        'name': 'Question',
        'icon': 'book',
        'link': '/mainapp/admin/question',
        'open': false,
    }

]

export const lessonactionmenus = [
    {
        'name': 'Screen share',
        'icon': 'desktop',
        'link': 'screen_share',
        'open': false,
    },
    {
        'name': 'Start video',
        'icon': 'video',
        'link': 'start_video',
        'open': false,
    },
    {
        'name': 'Chat',
        'icon': 'comment',
        'link': 'chat',
        'open': false,
    },
    {
        'name': 'Setting',
        'icon': 'gear',
        'link': 'setting',
        'open': false,
    }

]