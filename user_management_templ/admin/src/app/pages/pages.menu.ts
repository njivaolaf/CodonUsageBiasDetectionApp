export const ADMIN_PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'user',
        data: {
          menu: {
            title: 'general.menu.user',
            icon: 'ion-android-person',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
      },
      {
        path: 'mainpage',
        data: {
          menu: {
            title: 'general.menu.mainpage',
            icon: 'ion-ios-location',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
      },

    ],
  },
];

export const PAGES_MENU = [
  {
    path: 'pages',
    children: [

      {
        path: 'mainpage',
        data: {
          menu: {
            title: 'general.menu.mainpage',
            icon: 'ion-ios-location',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
      },
    ],
  },
];
