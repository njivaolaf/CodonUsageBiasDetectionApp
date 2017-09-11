# Install dependencies

$ npm install

# How To Create New Page

1. Run following commands:
$ ng g module pages\my-module --routing
$ ng g component pages\my-module --module=pages/my-module/my-module.module
2. Rename my-module-routing.module.ts to my-module.routing.ts
3. Follow instructions [here](https://akveo.github.io/ng2-admin/articles/013-create-new-page/)

# Run
$ ng serve --host=172.16.20.75

# Building project
$ npm run build

# Building for production environment
$ npm run build:prod:aot
