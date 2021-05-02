import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {Transactions} from './Transactions'
@Entity()
export class Customers {

    @PrimaryGeneratedColumn()
    customerId: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    isDeleted: boolean;
    
    @OneToMany(type => Transactions, (transactions: Transactions) => transactions.customerId)
    public transactions: Transactions[];
}