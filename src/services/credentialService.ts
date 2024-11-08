import { AppDataSource } from "../config/appDataSource";
import CredentialDto from "../dto/credentialDto";
import { Credential } from "../entities/Credential";
import { User } from "../entities/User";
import CredentialRepository from "../repositories/CredentialRepository";
import UserRepository from "../repositories/UserRepository";

export const getAllCredentialService = async (): Promise<Credential[]> => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const credentials: Credential[] = await queryRunner.manager.find(Credential, {
            relations: ["users"]
        });
        await queryRunner.commitTransaction();
        return credentials;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};

export const createCredential = async (credentialData: CredentialDto): Promise<Credential> => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const newCredential: Credential = queryRunner.manager.create(Credential, credentialData);
        const result: Credential = await queryRunner.manager.save(newCredential);
        await queryRunner.commitTransaction();
        return result;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};

export const validateCredential = async (credentialData: CredentialDto) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const loginStatus = { login: false, user: {} }; 

    try {
        const userCredentials: Credential | null = await CredentialRepository.findByUsername(credentialData.username);

        if (userCredentials) {
            const user : User | null = await UserRepository.findById(userCredentials.id);
            const isValid = userCredentials.username === credentialData.username && userCredentials.password === credentialData.password;

            if (user && isValid) {
                loginStatus.login = isValid;
                loginStatus.user = user;
                
                await queryRunner.commitTransaction();
                return loginStatus;
            } else {
                await queryRunner.commitTransaction();
                return loginStatus;
            }
        } else {
            await queryRunner.commitTransaction();
            return loginStatus;
        }
    } catch (err) {
        await queryRunner.rollbackTransaction();
        return loginStatus;
    } finally {
        await queryRunner.release();
    }
};
