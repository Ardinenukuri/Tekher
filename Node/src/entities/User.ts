import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({length: 100})
    name:string;
    
    @Column({length: 100, unique:True})
    email:string

    
}