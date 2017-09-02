export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'cbudetectmenu',
        data: {
          menu: {
            title: 'general.menu.cbudetectmenu',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
      },
      
      {
        path: '',
        data: {
          menu: {
            title: 'general.menu.pages',
            icon: 'ion-document',
            selected: false,
            expanded: false,
            order: 650,
          },
        },
        children: [
          {
            path: ['/login'],
            data: {
              menu: {
                title: 'general.menu.login',
              },
            },
          },
         
        ],
      },
     
      {
        path: '',
        data: {
          menu: {
            title: 'general.menu.external_link',
            url: 'http://www.google.com',
            icon: 'ion-android-exit',
            order: 800,
            target: '_blank',
          },
        },
      },
    ],
  },
];
