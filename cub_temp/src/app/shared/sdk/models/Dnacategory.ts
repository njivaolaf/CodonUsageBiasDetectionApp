/* tslint:disable */

declare var Object: any;
export interface DnacategoryInterface {
  "name"?: string;
  "id"?: number;
}

export class Dnacategory implements DnacategoryInterface {
  "name": string;
  "id": number;
  constructor(data?: DnacategoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Dnacategory`.
   */
  public static getModelName() {
    return "Dnacategory";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Dnacategory for dynamic purposes.
  **/
  public static factory(data: DnacategoryInterface): Dnacategory{
    return new Dnacategory(data);
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
      name: 'Dnacategory',
      plural: 'Dnacategories',
      path: 'Dnacategories',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
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
