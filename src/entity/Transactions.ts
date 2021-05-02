import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Customers } from "./Customers";

@Entity()
export class Transactions {
    @PrimaryGeneratedColumn()
    transactionId: number;


    @ManyToOne(type => Customers, (customer: Customers) => customer.transactions)
    @JoinColumn({ name: "customerId" })
    public customerId: number;
    
    @Column('double precision')
    amount: number;

    @Column()
    currency: string;

    @Column()
    isPaid: boolean;

    @Column()
    dueDate: string;

    @Column({'nullable': true})
    paidDate: string;

    @Column()
    isDeleted: boolean;

    @Column()
    hasBeenReminded: boolean;



}
