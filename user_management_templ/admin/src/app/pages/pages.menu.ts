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
        path: 'dna',
        data: {
          menu: {
            title: 'general.menu.dna',
            icon: 'ion-stats-bars',
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
            icon: 'ion-home',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
      },

    ],
  },
  {
        path: 'cub-detection',
        data: {
          menu: {
            title: 'general.menu.cub',
            icon: 'ion-calculator',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
      },
];

export const GUEST_PAGES_MENU = [
  {
    path: 'pages',
    children: [

      
       {
        path: 'cub-detection',
        data: {
          menu: {
            title: 'general.menu.cub',
            icon: 'ion-calculator',
            selected: true,
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
            icon: 'ion-home',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
      },
      {
        path: 'dna',
        data: {
          menu: {
            title: 'general.menu.dna',
            icon: 'ion-stats-bars',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
      },
      
    
    ],
  },
  {
        path: 'cub-detection',
        data: {
          menu: {
            title: 'general.menu.cub',
            icon: 'ion-calculator',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
      },
];
