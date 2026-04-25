import { Handbook } from "./handbook.model";

export interface CharacterDef {
    handbook: Handbook,
    id: number,
    name: string,
}

export class Character {
    private handbook: Handbook;
    public id: string = '';
    
    public name: string = '';
    public img: string = '';
    public notes: string = '';

    constructor(h: Handbook) {
        this.handbook = h;
    }
}