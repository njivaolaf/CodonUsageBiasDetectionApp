/* tslint:disable */

declare var Object: any;
export interface MediaInterface {
  "type"?: number;
  "name": string;
  "size": number;
  "dateCreated": Date;
  "id"?: number;
}

export class Media implements MediaInterface {
  "type": number;
  "name": string;
  "size": number;
  "dateCreated": Date;
  "id": number;
  constructor(data?: MediaInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Media`.
   */
  public static getModelName() {
    return "Media";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Media for dynamic purposes.
  **/
  public static factory(data: MediaInterface): Media{
    return new Media(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Media',
      plural: 'Media',
      path: 'Media',
      properties: {
        "type": {
          name: 'type',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "size": {
          name: 'size',
          type: 'number'
        },
        "dateCreated": {
          name: 'dateCreated',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
