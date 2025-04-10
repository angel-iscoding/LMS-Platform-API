import { Request, Response } from "express";
import { getAllUsersService , getUserService, registerUserService} from "../services/userService"; 
import { createCredential, validateCredential} from "../services/credentialService";
import { User } from "../entities/User";
import CredentialRepository from "../repositories/CredentialRepository";

export const getAllUsers = async (req:Request, res:Response) => {
    const users: User[] = await getAllUsersService();
    if (users.length === 0) {
        res.status(404).json({ error: "No se encontraron usuarios" })
    } else {
        res.status(200).json( users );
    }
};

export const getUser = async (req:Request, res:Response) => {
    const id = req.params.id;

    const user: User | null = await getUserService(parseInt(id));  
    
    if (user) res.status(200).json(user);
    else res.status(404).json({ error: "Usuario no encontrado" });
};

export const registerUser = async (req:Request, res:Response) => {
    try {
        const { name, email, birthdate, nDni, credentials} = req.body;
        const { username, password } = credentials;

        if (await CredentialRepository.thisUsernameExist(username)) {
            res.status(400).json({ error: "El nombre de usuario registrado ya existe, por favor, cambialo a uno no existente" });
        } else {
            const newCredential = await createCredential({ username, password });
            const newUser: User = await registerUserService(newCredential, { name, email });
            res.status(201).json({ newUser });
        }
    } catch (error) {
        res.status(400).json({ error: "Algunos parametros ingresados no son validos" });
    }
};


export const loginUser = async (req:Request, res:Response) => {
    try {
        const { username, password } = req.body;

        const {login, user} = await validateCredential({username, password});
        if (login) {
            res.status(200).json({ login, user });
        } else {
            res.status(400).json({ login, user })
        }
    } catch (error) {
        res.status(400).json({ error: "Algunos parametros ingresados no son validos" });
    }
};


