/* tslint:disable */

declare var Object: any;
export interface SequencepartInterface {
  "id"?: number;
  "dnaId"?: number;
}

export class Sequencepart implements SequencepartInterface {
  "id": number;
  "dnaId": number;
  constructor(data?: SequencepartInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Sequencepart`.
   */
  public static getModelName() {
    return "Sequencepart";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Sequencepart for dynamic purposes.
  **/
  public static factory(data: SequencepartInterface): Sequencepart{
    return new Sequencepart(data);
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
      name: 'Sequencepart',
      plural: 'Sequenceparts',
      path: 'Sequenceparts',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "dnaId": {
          name: 'dnaId',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
