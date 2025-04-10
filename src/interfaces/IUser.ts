import ICredential from "./ICredential";

interface IUser {
    id: number,
    name: string,
    email: string,
    credentials: ICredential[],
}

export default IUser;