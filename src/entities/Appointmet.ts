import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({
    name: "appointmets"
})

export class Appointmet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    title: string;

    @Column({
        length: 100
    })
    className: string

    @Column({
        length:1000
    })
    description: string;

    @Column({
        length: 20
    }) 
    date: string;

    @Column({
        length: 10
    }) 
    time: string;

    @Column()
    status: boolean;

    @ManyToOne(() => User, (user) => user.appointmets)
    user: User;
}