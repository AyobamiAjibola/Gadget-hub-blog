import bcrypt from "bcrypt";

const hash = (p: string): string => bcrypt.hashSync(p, 10);

const verifyBcryptPassword = (password: string, hash: any): boolean =>
  bcrypt.compareSync(password, hash);


export { hash, verifyBcryptPassword };
