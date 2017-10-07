import { UploadItem } from 'angular2-http-file-upload';

export class MyUploadItem extends UploadItem {
    constructor(file: any, serverurl: string) {
        super();
        this.url = serverurl;
        this.headers = { HeaderName: 'Header Value' }; //, AnotherHeaderName: 'Another Header Value' };
        this.file = file;
    }
}
